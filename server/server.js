console.log("--- NEW SERVER CODE LOADED ---"); // Verify this prints!

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// --- MONGODB CONNECTION ---
// IMPORTANT: We removed { useNewUrlParser: true, useUnifiedTopology: true }
// because Mongoose 6+ does this automatically and crashes if you include them.
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// --- REAL-TIME SOCKET SERVER ---
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`⚡ New Client Connected: ${socket.id}`);

  // 1. DRIVER TRACKING
  socket.on('driverLocationUpdate', (data) => {
    io.emit('locationUpdate', data);
  });

  // 2. CHAT SYSTEM
  socket.on('joinChat', (room) => {
    socket.join(room);
    console.log(`💬 User joined room: ${room}`);
  });

  socket.on('sendMessage', (data) => {
    console.log(`📩 Message in ${data.room}:`, data.text);
    io.to(data.room).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));