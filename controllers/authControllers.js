const adminModel = require("../models/adminModel");
const customerModel = require("../models/customerModel");
const sellerModel = require("../models/sellerModel");
const sellerCustomerModel = require("../models/Chat/sellerCustomerModel");
const { responseReturn } = require("../utils/response");
const bcrpty = require("bcrypt");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const { createToken } = require("../utils/tokenCreate");
const { debugLog } = require("../utils/debugLog");

class authControllers {
  admin_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await adminModel.findOne({ email }).select("+password");
      if (admin) {
        const match = await bcrpty.compare(password, admin.password);
        if (match) {
          if (!admin._id) {
            return responseReturn(res, 500, { error: "Invalid user record" });
          }
          const token = await createToken({
            id: admin._id.toString(),
            role: admin.role,
          });
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 200, { token, message: "Login Success" });
        } else {
          responseReturn(res, 404, { error: "Password Wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  getUser = async (req, res) => {
    const { id, role } = req;
    // #region agent log
    debugLog({location:'authControllers.js:getUser:entry',message:'getUser called',data:{id,role,dbUrl:process.env.DB_URL},hypothesisId:'A,C,D'});
    // #endregion
    try {
      if (role === "admin") {
        const user = await adminModel.findById(id);
        // #region agent log
        debugLog({location:'authControllers.js:getUser:admin-branch',message:'admin lookup result',data:{found:!!user,userId:user?._id?.toString()},hypothesisId:'A,D'});
        // #endregion
        if (!user) {
          return responseReturn(res, 404, { error: "User not found" });
        }
        responseReturn(res, 200, { userInfo: user });
      } else if (role === "customer") {
        const customer = await customerModel.findById(id);
        if (!customer) {
          return responseReturn(res, 404, { error: "User not found" });
        }
        responseReturn(res, 200, {
          userInfo: { ...customer.toObject(), role: "customer" },
        });
      } else {
        const seller = await sellerModel.findById(id);
        // #region agent log
        debugLog({location:'authControllers.js:getUser:seller-branch',message:'seller lookup result',data:{found:!!seller,sellerId:seller?._id?.toString()},hypothesisId:'A,C,D'});
        // #endregion
        if (!seller) {
          return responseReturn(res, 404, { error: "User not found" });
        }
        responseReturn(res, 200, { userInfo: seller });
      }
    } catch (error) {
      // #region agent log
      debugLog({location:'authControllers.js:getUser:error',message:'getUser exception',data:{errorMessage:error.message,errorName:error.name},hypothesisId:'D'});
      // #endregion
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  seller_register = async (req, res) => {
    const { email, name, password } = req.body;
    try {
      const getUser = await sellerModel.findOne({ email });
      if (getUser) {
        responseReturn(res, 404, { error: "Email Already Exit" });
      } else {
        const seller = await sellerModel.create({
          name,
          email,
          password: await bcrpty.hash(password, 10),
          method: "menualy",
          shopInfo: {},
        });
        await sellerCustomerModel.create({
          myId: seller.id,
        });

        const token = await createToken({
          id: seller.id,
          role: seller.role,
        });

        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        responseReturn(res, 201, { token, message: "Register Success" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  seller_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const seller = await sellerModel.findOne({ email }).select("+password");
      if (seller) {
        const match = await bcrpty.compare(password, seller.password);
        if (match) {
          if (!seller._id) {
            return responseReturn(res, 500, { error: "Invalid user record" });
          }
          const token = await createToken({
            id: seller._id.toString(),
            role: seller.role,
          });
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 200, { token, message: "Login Success" });
        } else {
          responseReturn(res, 404, { error: "Password Wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  profile_image_upload = async (req, res) => {
    const { id, role } = req;
    const form = formidable({ multiples: true });
    form.parse(req, async (err, _, files) => {
      if (err) {
        return responseReturn(res, 404, { error: "something went wrong" });
      }

      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
      });
      const { image } = files;

      try {
        const result = await cloudinary.uploader.upload(image.filepath, {
          folder: "profile",
        });
        if (result) {
          if (role === "customer") {
            await customerModel.findByIdAndUpdate(id, {
              image: result.url,
            });
            const userInfo = await customerModel.findById(id);
            return responseReturn(res, 201, {
              message: "Profile Image Upload Successfully",
              userInfo: { ...userInfo?.toObject(), role: "customer" },
            });
          }

          await sellerModel.findByIdAndUpdate(id, {
            image: result.url,
          });
          const userInfo = await sellerModel.findById(id);
          responseReturn(res, 201, {
            message: "Profile Image Upload Successfully",
            userInfo,
          });
        } else {
          responseReturn(res, 404, { error: "Image Upload Failed" });
        }
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  profile_info_add = async (req, res) => {
    const { division, district, shopName, sub_district, name } = req.body;
    const { id, role } = req;

    try {
      if (role === "customer") {
        const update = {};
        if (typeof name === "string" && name.trim()) {
          update.name = name.trim();
        }
        await customerModel.findByIdAndUpdate(id, update);
        const userInfo = await customerModel.findById(id);
        return responseReturn(res, 201, {
          message: "Profile info Add Successfully",
          userInfo: { ...userInfo?.toObject(), role: "customer" },
        });
      }

      await sellerModel.findByIdAndUpdate(id, {
        shopInfo: {
          shopName,
          division,
          district,
          sub_district,
        },
      });

      const userInfo = await sellerModel.findById(id);
      responseReturn(res, 201, {
        message: "Profile info Add Successfully",
        userInfo,
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  logout = async (req, res) => {
    try {
      res.cookie("accessToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      responseReturn(res, 200, { message: "Logout Success" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new authControllers();
