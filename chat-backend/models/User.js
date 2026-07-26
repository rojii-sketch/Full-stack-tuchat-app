const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  avatar: { type: String, default: '' },
  status: { type: String, default: 'Online' },
  about: { type: String, default: 'Hey there! I am using tuchat.' },
  authProvider: { type: String, default: 'local' },
  
  // Persist hidden/deleted chats
  hiddenChats: { type: [String], default: [] },

  // 👇 ADD THIS BACK SO CLEAR CHAT TIMESTAMPS PERSIST
  clearedChats: [{
    target: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;