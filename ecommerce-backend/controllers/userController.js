const User = require('../models/user');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

exports.me = async (req, res) => {
  const { username } = req.user
  const user = await User.findByPk(username, { attributes: { exclude: ['password'] } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user)
}

exports.editDetails = async (req, res) => {
  const { username, displayname, email, phone, address } = req.body;

  try {
    // Find the current user
    const user = await User.findByPk(username, { attributes: { exclude: ['password'] } });
    
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if email or phone exists on any other user
    const conflictingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: email },   // Check for matching email
          { phone: phone }    // Check for matching phone
        ],
        username: { [Op.ne]: username } // Exclude the current user
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

    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the user." });
  }
};

exports.changePassword = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    // Fetch the user by username (or ID)
    const user = await User.findByPk(username);
    
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if the current password is correct
    if (!(await bcrypt.compare(currentPassword, user.dataValues.password))) {
      return res.status(400).json({ message: 'Incorrect Current Password!' });
    }

    // Hash the new password and set it
    user.setDataValue('password', await bcrypt.hash(newPassword, 10));
    await user.save();

    res.json({ message: "Password changed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while changing the password." });
  }
};

exports.deleteAccount  = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Fetch the user by username (or ID)
    const user = await User.findByPk(username);
    
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if the password is correct
    if (!(await bcrypt.compare(password, user.dataValues.password))) {
      return res.status(400).json({ message: 'Incorrect Password!' });
    }
    await user.destroy()
    res.json({ message: "Accound deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while deleting the account." });
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.editUserRole = async (req, res) => {
  const { username } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findByPk(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.set({role});
    await user.save();

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting user" });
  }
}; 

exports.deleteUser = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findByPk(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting user" });
  }
};