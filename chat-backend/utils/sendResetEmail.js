const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendResetEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Chat App Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e5e5ea; border-radius: 10px; max-width: 500px; margin: auto;">
        <h2 style="color: #FF3B30; text-align: center;">Reset Your Password</h2>
        <p style="color: #333; font-size: 16px;">We received a request to reset the password for your account. Please use the 6-digit code below to create a new password:</p>
        <div style="background-color: #F5F7FA; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #FF3B30; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #8E8E93; font-size: 13px; text-align: center;">If you did not request this, please ignore this email. This code will expire in 15 minutes.</p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;