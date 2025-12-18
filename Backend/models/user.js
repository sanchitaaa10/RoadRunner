const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['super_admin', 'dispatcher', 'driver'],
    default: 'driver'
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'offline'
  },
  // --- NEW VEHICLE FIELDS ---
  vehicleType: {
    type: String,
    enum: ['Truck', 'Van', 'Bike', 'Scooter'],
    default: 'Truck'
  },
  licensePlate: {
    type: String,
    default: 'MH-04-XX-0000' // Default placeholder
  }
  // --------------------------
});

// ... (keep the existing pre-save hash middleware and export logic) ...
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);