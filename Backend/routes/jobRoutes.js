const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// DEBUG CHECK: If this prints "undefined", the controller is broken
if (!jobController.getJobs) {
  console.error("❌ CRITICAL ERROR: jobController functions are undefined!");
} else {
  console.log("✅ Job Controller Loaded Successfully");
}

router.get('/', jobController.getJobs);
router.post('/', jobController.createJob);
router.put('/:id', jobController.updateJob);

module.exports = router;
