const express = require('express');
const router = express.Router();
const { register, login, getDrivers, updateDriverStatus } = require('../controllers/authController'); // <--- Import it

router.post('/register', register);
router.post('/login', login);
router.get('/drivers', getDrivers);

// NEW ROUTE: PUT /api/auth/status/:id
router.put('/status/:id', updateDriverStatus); 

module.exports = router;