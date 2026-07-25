const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 900 // MongoDB will automatically delete this document after 900 seconds (15 minutes)
  }
});

module.exports = mongoose.model('OTP', otpSchema);