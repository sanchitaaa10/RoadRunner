const Job = require('../models/Job');

// 1. Get Jobs
const getJobs = async (req, res) => {
  console.log("📥 GET /api/jobs Request Received"); // Debug Log
  try {
    const jobs = await Job.find()
      .populate('assignedDriver', 'name vehicleType')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("❌ Error fetching jobs:", err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 2. Create Job
const createJob = async (req, res) => {
  console.log("📥 POST /api/jobs Body:", req.body); // Debug Log
  const { orderId, pickupAddress, dropoffAddress, priority } = req.body;
  
  try {
    const existingJob = await Job.findOne({ orderId });
    if (existingJob) return res.status(400).json({ message: 'Order ID exists' });

    const newJob = new Job({ 
      orderId, pickupAddress, dropoffAddress, 
      priority: priority || 'Normal', 
      status: 'pending' 
    });
    
    await newJob.save();
    console.log("✅ Job Created:", newJob.orderId);
    res.status(201).json(newJob);
  } catch (err) {
    console.error("❌ Error creating job:", err);
    res.status(500).json({ message: 'Error creating job' });
  }
};

// 3. Update Job
const updateJob = async (req, res) => {
  console.log(`📥 PUT /api/jobs/${req.params.id}`); // Debug Log
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    ).populate('assignedDriver', 'name');
    res.json(updatedJob);
  } catch (err) {
    console.error("❌ Error updating job:", err);
    res.status(500).json({ message: 'Error updating job' });
  }
};

// --- EXPORT MUST BE AT THE BOTTOM ---
module.exports = {
  getJobs,
  createJob,
  updateJob
};