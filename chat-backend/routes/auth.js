const express = require('express');
const router = express.Router();
const sendResetEmail = require('../utils/sendResetEmail'); // <-- ADD THIS IMPORT
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // <-- NEW: Required for generating auth tokens
const User = require('../models/User');
const OTP = require('../models/Otp');
const sendOtpEmail = require('../utils/sendEmail');

// ==========================================
// 1. POST: /api/auth/register
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      authProvider: 'local'
    });
    await newUser.save();

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const newOtp = new OTP({
      email,
      otp: generatedOtp
    });
    await newOtp.save();

    await sendOtpEmail(email, generatedOtp);

    res.status(201).json({ 
      message: 'User registered successfully. Please check your email for the OTP.',
      email: newUser.email 
    });

  } catch (error) {
    console.error('Registration/Email Error:', error);
    res.status(500).json({ error: 'Failed to process registration or send OTP email.' });
  }
});

// ==========================================
// 2. POST: /api/auth/verify-otp
// ==========================================
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Check if OTP is correct and hasn't expired
    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    // 2. Find user and mark as verified
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }
    user.isVerified = true;
    await user.save();

    // 3. Delete the used OTP from the database
    await OTP.deleteOne({ _id: validOtp._id });

    // 4. Generate the JWT (JSON Web Token)
    const token = jwt.sign(
      { userId: user._id, name: user.name }, 
      process.env.JWT_SECRET || 'super_secret_dev_key', 
      { expiresIn: '7d' } // Token expires in 7 days
    );

    res.status(200).json({ 
      message: 'Account verified successfully!',
      token,
      name: user.name
    });

  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ error: 'Server error during verification.' });
  }
});

// ==========================================
// 3. POST: /api/auth/login
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // 2. Check if the account has been verified via OTP
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    // 3. Compare the provided password with the hashed password in MongoDB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // 4. Generate the JWT
    const token = jwt.sign(
      { userId: user._id, name: user.name }, 
      process.env.JWT_SECRET || 'super_secret_dev_key', 
      { expiresIn: '7d' }
    );

    // 5. Send success response back to mobile app
    res.status(200).json({
      message: 'Logged in successfully',
      token,
      name: user.name
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// ==========================================
// 4. POST: /api/auth/forgot-password
// ==========================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Security best practice: Don't reveal if the email exists or not to prevent enumeration attacks
      return res.status(200).json({ message: 'If that email exists, a reset code has been sent.' });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to the exact same OTP collection we used for registration
    const newOtp = new OTP({ email, otp: generatedOtp });
    await newOtp.save();

    await sendResetEmail(email, generatedOtp);

    res.status(200).json({ message: 'If that email exists, a reset code has been sent.' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ error: 'Server error processing request.' });
  }
});

// ==========================================
// 5. POST: /api/auth/reset-password
// ==========================================
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // 1. Verify the OTP
    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    // 2. Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    // 3. Hash the new password and save it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    user.password = hashedPassword;
    await user.save();

    // 4. Delete the used OTP
    await OTP.deleteOne({ _id: validOtp._id });

    res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ error: 'Server error during password reset.' });
  }
});
// ==========================================
// 6. POST: /api/auth/resend-otp
// ==========================================
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ error: 'User not found.' });
    if (user.isVerified) return res.status(400).json({ error: 'User is already verified.' });

    // 1. Delete any old, expired OTPs for this email to prevent clutter
    await OTP.deleteMany({ email });

    // 2. Generate a fresh 6-digit code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtp = new OTP({ email, otp: generatedOtp });
    await newOtp.save();

    // 3. Email the new code using your existing NodeMailer setup
    // Note: Ensure `sendOtpEmail` is imported at the top of your file!
    const sendOtpEmail = require('../utils/sendEmail'); 
    await sendOtpEmail(email, generatedOtp);

    res.status(200).json({ message: 'A new OTP has been sent to your email.' });
  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({ error: 'Server error sending OTP.' });
  }
});

module.exports = router;