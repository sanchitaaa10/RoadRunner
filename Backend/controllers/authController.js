const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = await User.create({ name, email, password, role });
    
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // --- SPY CODE START ---
  console.log("------------------------------------------------");
  console.log("📞 LOGIN ATTEMPT FROM PHONE/BROWSER:");
  console.log("Email received:", email);
  console.log("Password received:", password);
  // --- SPY CODE END ---

  try {
    const user = await User.findOne({ email });
    
    // --- SPY CODE START ---
    if (!user) {
        console.log("❌ User NOT found in Database.");
    } else {
        console.log("✅ User found:", user.email);
        console.log("🔑 Stored Hashed Password:", user.password.substring(0, 10) + "...");
    }
    // --- SPY CODE END ---

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log("✅ Password MATCH! Logging in..."); // SPY CODE
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      console.log("❌ Password MISMATCH."); // SPY CODE
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("SERVER ERROR:", error); // SPY CODE
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all drivers
// @route   GET /api/auth/drivers
exports.getDrivers = async (req, res) => {
  try {
    // Find all users where role is 'driver', exclude the password field
    const drivers = await User.find({ role: 'driver' }).select('-password');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// ... existing imports

// NEW: Toggle Driver Availability
exports.updateDriverStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'available' or 'offline'

    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-password');
    
    // Optional: Emit socket event so the map updates instantly
    // (We need to pass 'io' to this controller if we want that, 
    // but for now, simple DB update is enough)
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
};
