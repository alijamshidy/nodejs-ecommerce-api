const nodemailer = require("nodemailer");

const getTransporter = () => {
  if (!process.env.SMTP_HOST) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

module.exports.sendOtpEmail = async (email, otp) => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!transporter) {
    console.log(`[OTP] SMTP not configured. OTP for ${email}: ${otp}`);
    return;
  }

  await transporter.sendMail({
    from,
    to: email,
    subject: "Your login verification code",
    text: `Your verification code is: ${otp}. It expires in 10 minutes.`,
    html: `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes. Do not share this code with anyone.</p>`,
  });
};
