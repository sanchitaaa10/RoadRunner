const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  pickupAddress: { type: String, required: true },
  dropoffAddress: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'assigned', 'picked_up', 'delivered'], 
    default: 'pending' 
  },
  assignedDriver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);