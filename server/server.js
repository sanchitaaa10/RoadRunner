const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// --- FIXING THE PATHS HERE ---
// Your files are named 'authRoutes.js' and 'jobRoutes.js', NOT 'auth' and 'jobs'
const authRoutes = require('./routes/authRoutes'); // <--- WAS ./routes/auth
const jobRoutes = require('./routes/jobRoutes');   // <--- WAS ./routes/jobs

const app = express();


// ... rest of your code stays the same ...
const server = http.createServer(app);

// --- 1. CRITICAL: ALLOW ALL ORIGINS (CORS) ---
app.use(cors({
  origin: "*", // Allow Laptop, Phone, Tablet - EVERYONE
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// --- 2. REQUEST LOGGER (See if phone reaches server) ---
app.use((req, res, next) => {
  console.log(`📡 REQUEST RECEIVED: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Socket.io Setup
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('driverLocationUpdate', (data) => {
    console.log('📍 GPS:', data.driverId, data.lat, data.lng);
    io.emit('locationUpdate', data);
  });
});

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5001;

// --- 3. LISTEN ON 0.0.0.0 (Network Access) ---
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on Port ${PORT}`);
  console.log(`   --> Allow access from your IP`);
});