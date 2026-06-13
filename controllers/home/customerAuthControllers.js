const crypto = require("crypto");
const customerModel = require("../../models/customerModel");
const otpModel = require("../../models/otpModel");
const { responseReturn } = require("../../utils/response");
const bcrypt = require("bcrypt");
const sellerCustomerModel = require("../../models/Chat/sellerCustomerModel");
const { createToken } = require("../../utils/tokenCreate");
const { sendOtpEmail } = require("../../utils/sendEmail");

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

const generateOtp = () => String(crypto.randomInt(100000, 1000000));

class customerAuthControllers {
  customer_register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const customer = await customerModel.findOne({ email });
      if (customer) {
        responseReturn(res, 404, { error: "Email Already Exits" });
      } else {
        const createCustomer = await customerModel.create({
          name: name.trim(),
          email: email.trim(),
          password: await bcrypt.hash(password, 10),
          method: "menualy",
        });

        await sellerCustomerModel.create({
          myId: createCustomer.id,
        });
        const token = await createToken({
          id: createCustomer.id,
          name: createCustomer.name,
          email: createCustomer.email,
          method: createCustomer.method,
        });
        res.cookie("customerToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        responseReturn(res, 200, { message: "User Register Success", token });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  customer_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const customer = await customerModel
        .findOne({ email })
        .select("+password");
      if (customer) {
        const match = await bcrypt.compare(password, customer.password);
        if (match) {
          const token = await createToken({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            method: customer.method,
          });
          res.cookie("customerToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 201, { message: "User Login Success", token });
        } else {
          responseReturn(res, 404, { error: "Password Wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email Not Found" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  customer_logout = async (req, res) => {
    res.cookie("customerToken", "", {
      expires: new Date(Date.now()),
    });
    responseReturn(res, 200, { message: "User Logout Success" });
  };

  send_otp = async (req, res) => {
    const email = req.body.email?.trim()?.toLowerCase();

    if (!email) {
      return responseReturn(res, 400, { error: "Email is required" });
    }

    try {
      const customer = await customerModel.findOne({ email });

      if (!customer) {
        return responseReturn(res, 200, {
          message: "If this email is registered, an OTP has been sent",
        });
      }

      const recentOtp = await otpModel.findOne({ email }).sort({ createdAt: -1 });

      if (
        recentOtp &&
        Date.now() - recentOtp.createdAt.getTime() < OTP_RESEND_COOLDOWN_MS
      ) {
        return responseReturn(res, 429, {
          error: "Please wait before requesting a new OTP",
        });
      }

      const otp = generateOtp();
      const otpHash = await bcrypt.hash(otp, 10);
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

      await otpModel.deleteMany({ email });
      await otpModel.create({ email, otpHash, expiresAt });
      await sendOtpEmail(email, otp);

      responseReturn(res, 200, {
        message: "If this email is registered, an OTP has been sent",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  verify_otp = async (req, res) => {
    const email = req.body.email?.trim()?.toLowerCase();
    const otp = req.body.otp?.trim();

    if (!email || !otp) {
      return responseReturn(res, 400, { error: "Email and OTP are required" });
    }

    try {
      const otpRecord = await otpModel.findOne({ email });

      if (!otpRecord) {
        return responseReturn(res, 404, { error: "Invalid or expired OTP" });
      }

      if (otpRecord.expiresAt < new Date()) {
        await otpModel.deleteOne({ _id: otpRecord._id });
        return responseReturn(res, 404, { error: "Invalid or expired OTP" });
      }

      if (otpRecord.attempts >= MAX_VERIFY_ATTEMPTS) {
        await otpModel.deleteOne({ _id: otpRecord._id });
        return responseReturn(res, 404, {
          error: "Too many failed attempts. Please request a new OTP",
        });
      }

      const match = await bcrypt.compare(otp, otpRecord.otpHash);

      if (!match) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        return responseReturn(res, 404, { error: "Invalid OTP" });
      }

      const customer = await customerModel.findOne({ email });

      if (!customer) {
        return responseReturn(res, 404, { error: "Email Not Found" });
      }

      await otpModel.deleteOne({ _id: otpRecord._id });

      const token = await createToken({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        method: customer.method,
      });

      res.cookie("customerToken", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      responseReturn(res, 201, { message: "User Login Success", token });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new customerAuthControllers();
