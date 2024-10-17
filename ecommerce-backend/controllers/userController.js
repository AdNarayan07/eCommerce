// Import necessary modules
const User = require('../models/user');  // User model for database interaction
const { Op } = require('sequelize');    // Sequelize operators for querying
const bcrypt = require('bcryptjs');      // Library for hashing and comparing passwords

/**
 * Get user profile
 * Retrieves the authenticated user's data, excluding the password field.
 */
exports.me = async (req, res) => {
  const { username } = req.user;  // Extract username from authenticated request
  const user = await User.findByPk(username, { attributes: { exclude: ['password'] } });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Return user data (excluding password)
  res.json(user);
};

/**
 * Edit user details
 * Updates the user's profile information (displayname, email, phone, and address).
 */
exports.editDetails = async (req, res) => {
  const { username, displayname, email, phone, address } = req.body;

  try {
    // Find the current user by primary key (username)
    const user = await User.findByPk(username, { attributes: { exclude: ['password'] } });
    
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check for conflicting email or phone number in other users
    const conflictingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { phone: phone }],
        username: { [Op.ne]: username }  // Exclude the current user from the query
      }
    });

    if (conflictingUser) {
      return res.status(400).json({
        message: "Email or phone number already in use by another user."
      });
    }

    // No conflicts, proceed with updating user details
    user.set({ displayname, email, phone, address });
    await user.save();

    res.json(user);  // Return updated user data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the user." });
  }
};

/**
 * Change password
 * Updates the user's password after verifying the current password.
 */
exports.changePassword = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    // Find the user by username (or ID)
    const user = await User.findByPk(username);
    
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Verify the current password
    if (!(await bcrypt.compare(currentPassword, user.dataValues.password))) {
      return res.status(400).json({ message: 'Incorrect Current Password!' });
    }

    // Hash the new password and save it
    user.setDataValue('password', await bcrypt.hash(newPassword, 10));
    await user.save();

    res.json({ message: "Password changed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while changing the password." });
  }
};

/**
 * Delete account
 * Deletes a user account after verifying the user's password.
 */
exports.deleteAccount = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findByPk(username);
    
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Verify the password before deleting the account
    if (!(await bcrypt.compare(password, user.dataValues.password))) {
      return res.status(400).json({ message: 'Incorrect Password!' });
    }

    // Delete the user account
    await user.destroy();
    res.json({ message: "Account deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while deleting the account." });
  }
};

/**
 * Get all users
 * Retrieves a list of all users, excluding password fields.
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

/**
 * Edit user role
 * Updates the role of a specific user.
 */
exports.editUserRole = async (req, res) => {
  const { username } = req.params;  // Get username from request parameters
  const { role } = req.body;  // Get the new role from the request body

  try {
    const user = await User.findByPk(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user role
    user.set({ role });
    await user.save();

    res.json(user);  // Return updated user data
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating user role" });
  }
};

/**
 * Delete user
 * Deletes a specific user account by username.
 */
exports.deleteUser = async (req, res) => {
  const { username } = req.params;  // Get username from request parameters

  try {
    const user = await User.findByPk(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user account
    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting user" });
  }
};
