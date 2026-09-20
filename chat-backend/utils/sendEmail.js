const nodemailer = require('nodemailer');

// 1. Create the SMTP Transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 2. The OTP Email Sender Function
const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Chat App Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your Account Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e5e5ea; border-radius: 10px; max-width: 500px; margin: auto;">
        <h2 style="color: #0A84FF; text-align: center;">Verify Your Account</h2>
        <p style="color: #333; font-size: 16px;">Thank you for registering! Please use the 6-digit verification code below to complete your registration:</p>
        <div style="background-color: #F5F7FA; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #0A84FF; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #8E8E93; font-size: 13px; text-align: center;">This code will automatically expire in 15 minutes.</p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;