const express = require('express'); // Import express
const { me, editDetails, changePassword, deleteAccount, getAllUsers, editUserRole, deleteUser } = require('../controllers/userController'); // Import user controller functions
const authentication = require('../middleware/authentication'); // Import authentication middleware
const verifyUser = require('../middleware/verifyUser'); // Import verifyUser middleware
const authorisation = require('../middleware/authorisation'); // Import authorisation middleware
const router = express.Router(); // Create a router instance

router.get('/me', authentication, me); // Get the current user's details
router.delete('/me', authentication, verifyUser, deleteAccount); // Delete the current user's account
router.patch('/me/details', authentication, verifyUser, editDetails); // Edit current user's details
router.patch('/me/password', authentication, verifyUser, changePassword); // Change current user's password

router.get('/', authentication, authorisation(['admin']), getAllUsers); // Get all users (admin only)
router.patch('/:username/role', authentication, authorisation(['admin']), editUserRole); // Edit user role (admin only)
router.delete('/:username', authentication, authorisation(['admin']), deleteUser); // Delete a user (admin only)

module.exports = router; // Export the router
