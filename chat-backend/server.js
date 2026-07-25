const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

console.log("⏳ Attempting to connect to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🗄️  SUCCESS: Connected to MongoDB Atlas!'))
  .catch(err => console.error('🔴 ERROR: MongoDB Connection Failed:', err.message));

// --- MESSAGE SCHEMA ---
const messageSchema = new mongoose.Schema({
  text: String,
  senderId: String,
  senderName: String,
  receiverName: { type: String, default: null }, // Private DM target
  roomName: { type: String, default: null },     // Group or Channel target
  imageUrl: { type: String, default: null },     // Image attachment URL
  tags: [String],                                // Extracted #tags
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// --- ROOM / GROUP / CHANNEL SCHEMA ---
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['group', 'channel'], default: 'group' }, // group = collaborative, channel = broadcast only
  admin: String,
  description: String,
  tags: [String],
  members: [String]
});
const Room = mongoose.model('Room', roomSchema);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    socket.user = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_dev_key');
    next();
  } catch (err) { return next(new Error('Invalid token')); }
});

const activeUsers = new Map(); 
const userSockets = new Map(); 

io.on('connection', async (socket) => {
  console.log(`🟢 User connected: ${socket.user.name}`);

  activeUsers.set(socket.id, socket.user.name);
  userSockets.set(socket.user.name, socket.id);
  
  io.emit('online_users', Array.from(new Set(activeUsers.values())));

  try {
    const User = mongoose.model('User');
    const dbUser = await User.findOne({ name: socket.user.name });
   const clearedMap = new Map(dbUser?.clearedChats?.map(c => [c.target, new Date(c.timestamp)]) || []);

    const rawHistory = await Message.find({
      $or: [
        { receiverName: null, roomName: null }, 
        { receiverName: socket.user.name }, 
        { senderName: socket.user.name, receiverName: { $ne: null } }
      ]
    }).sort({ createdAt: 1 }).limit(100);

    // Filter out messages older than the user's local clear timestamp for that chat
    const filteredHistory = rawHistory.filter(msg => {
      let target = 'Global Community';
      if (msg.roomName) {
        target = msg.roomName;
      } else if (msg.receiverName) {
        target = msg.senderName === socket.user.name ? msg.receiverName : msg.senderName;
      }
      const clearTime = clearedMap.get(target);
      if (clearTime && new Date(msg.createdAt) <= clearTime) {
        return false;
      }
      return true;
    });

    socket.emit('chat_history', filteredHistory);
  } catch (error) { console.error("Error fetching history:", error); }

  // --- ROOM JOINING (With Local Clear Filter) ---
  socket.on('join_room', async (roomName) => {
    socket.join(roomName);
    console.log(`📂 User ${socket.user.name} joined room: ${roomName}`);
    try {
      const User = mongoose.model('User');
      const dbUser = await User.findOne({ name: socket.user.name });
     const clearTime = dbUser?.clearedChats?.find(c => c.target === roomName)?.timestamp || new Date(0);

      const roomMessages = await Message.find({ 
        roomName,
        createdAt: { $gt: new Date(clearTime) }
      }).sort({ createdAt: 1 }).limit(50);

      socket.emit('room_history', { roomName, messages: roomMessages });
    } catch (err) { console.error("Error fetching room history:", err); }
  });

  socket.on('leave_room', (roomName) => {
    socket.leave(roomName);
  });

  socket.on('send_message', async (messageData) => {
    try {
      // Channel Broadcast-Only Permission Check
      if (messageData.roomName) {
        const targetRoom = await Room.findOne({ name: messageData.roomName });
        if (targetRoom && targetRoom.type === 'channel' && targetRoom.admin !== socket.user.name) {
          return socket.emit('error_message', { error: 'Only the admin can post messages in this channel.' });
        }
      }

      const foundTags = messageData.text.match(/#\w+/g) || [];

      const newMessage = new Message({
        text: messageData.text,
        senderId: socket.user.userId,
        senderName: socket.user.name,
        receiverName: messageData.receiverName || null,
        roomName: messageData.roomName || null,
        imageUrl: messageData.imageUrl || null,
        tags: foundTags
      });
      await newMessage.save();

      const msgPayload = {
        id: newMessage._id.toString(),
        text: newMessage.text,
        senderId: newMessage.senderId,
        senderName: newMessage.senderName,
        receiverName: newMessage.receiverName,
        roomName: newMessage.roomName,
        imageUrl: newMessage.imageUrl,
        tags: newMessage.tags,
        createdAt: newMessage.createdAt
      };

      if (newMessage.roomName) {
        io.to(newMessage.roomName).emit('receive_message', msgPayload);
      } else if (newMessage.receiverName) {
        const targetSocketId = userSockets.get(newMessage.receiverName);
        if (targetSocketId) io.to(targetSocketId).emit('receive_message', msgPayload);
        socket.emit('receive_message', msgPayload);
      } else {
        io.emit('receive_message', msgPayload);
      }
    } catch (err) { console.error("Error saving message:", err); }
  });

  socket.on('typing_start', (data) => {
    if (data && data.receiverName) {
      const targetSocketId = userSockets.get(data.receiverName);
      if (targetSocketId) io.to(targetSocketId).emit('user_typing', { senderName: socket.user.name, receiverName: data.receiverName });
    } else if (data && data.roomName) {
      socket.to(data.roomName).emit('user_typing', { senderName: socket.user.name, roomName: data.roomName });
    } else {
      socket.broadcast.emit('user_typing', { senderName: socket.user.name, receiverName: null });
    }
  });

  socket.on('typing_stop', (data) => {
    if (data && data.receiverName) {
      const targetSocketId = userSockets.get(data.receiverName);
      if (targetSocketId) io.to(targetSocketId).emit('user_stopped_typing', { senderName: socket.user.name, receiverName: data.receiverName });
    } else if (data && data.roomName) {
      socket.to(data.roomName).emit('user_stopped_typing', { senderName: socket.user.name, roomName: data.roomName });
    } else {
      socket.broadcast.emit('user_stopped_typing', { senderName: socket.user.name, receiverName: null });
    }
  });

  socket.on('disconnect', () => {
    console.log(`🟢 User disconnected: ${socket.user.name}`);
    activeUsers.delete(socket.id);
    userSockets.delete(socket.user.name);
    io.emit('online_users', Array.from(new Set(activeUsers.values())));
  });

  // --- Delete Single Message Event ---
  socket.on('delete_message', async ({ messageId, receiverName, roomName }) => {
    try {
      const deletedMsg = await Message.findByIdAndDelete(messageId);
      if (deletedMsg) {
        const payload = { messageId };
        if (roomName) {
          io.to(roomName).emit('message_deleted', payload);
        } else if (receiverName) {
          const targetSocketId = userSockets.get(receiverName);
          if (targetSocketId) io.to(targetSocketId).emit('message_deleted', payload);
          socket.emit('message_deleted', payload);
        } else {
          io.emit('message_deleted', payload);
        }
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  });

  // --- Clear Chat Event (Private / Local Only) ---
  socket.on('clear_chat', async ({ receiverName, roomName }) => {
    try {
      const target = roomName || receiverName || 'Global Community';
      const User = mongoose.model('User');
      
      // Push clear timestamp to user's profile without deleting DB messages
      await User.findOneAndUpdate(
        { name: socket.user.name },
        { $push: { clearedChats: { target, timestamp: new Date() } } }
      );

      // Emit chat_cleared ONLY to the user who requested it
      socket.emit('chat_cleared', { roomName, partner: receiverName, global: !roomName && !receiverName });
    } catch (err) {
      console.error("Error clearing chat locally:", err);
    }
  });
});

// ==========================================
// ROOMS API ROUTES
// ==========================================
app.post('/api/rooms/create', async (req, res) => {
  try {
    const { name, type, description, tags, admin } = req.body;
    const existing = await Room.findOne({ name });
    if (existing) return res.status(400).json({ error: 'Room name already exists.' });
    
    const formattedTags = tags ? tags.split(',').map(t => t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`) : [];


    const newRoom = new Room({ 
      name, 
      type: type || 'group', 
      description, 
      tags: formattedTags, 
      admin, 
      members: [admin] 
    });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    console.error("Room Creation Error:", err);
    res.status(500).json({ error: 'Server error creating room.' });
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching rooms.' });
  }
});

// ==========================================
// PROFILE UPDATE API ROUTE
// ==========================================
app.put('/api/auth/profile', async (req, res) => {
  try {
    const { email, avatar, status, about } = req.body;
    const User = mongoose.model('User');
    
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { avatar, status, about },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: 'User not found.' });

    res.json({ 
      message: 'Profile updated successfully!', 
      avatar: updatedUser.avatar, 
      status: updatedUser.status, 
      about: updatedUser.about 
    });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ error: 'Server error updating profile.' });
  }
});

// ==========================================
// HIDE / DELETE CHAT API ROUTE
// ==========================================
app.put('/api/auth/hide-chat', async (req, res) => {
  try {
    const { email, chatName } = req.body;
    const User = mongoose.model('User');
    
    const user = await User.findOneAndUpdate(
      { email },
      { $addToSet: { hiddenChats: chatName } },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ message: 'Chat hidden successfully', hiddenChats: user.hiddenChats });
  } catch (err) {
    console.error("Hide Chat Error:", err);
    res.status(500).json({ error: 'Server error hiding chat.' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));