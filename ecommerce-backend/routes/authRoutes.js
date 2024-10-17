const express = require('express'); // Import express
const { register, login } = require('../controllers/authController'); // Import controller functions
const router = express.Router(); // Create a router instance

router.post('/register', register); // Route for user registration
router.post('/login', login); // Route for user login

module.exports = router; // Export the router
