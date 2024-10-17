// Import necessary modules
const bcrypt = require('bcryptjs');  // Library for hashing and comparing passwords
const jwt = require('jsonwebtoken');  // Library for generating and verifying JWT tokens
const User = require('../models/user');  // User model for database interaction
const { Op } = require("sequelize");  // Sequelize operators for querying

/**
 * User registration controller
 * Registers a new user by verifying the uniqueness of username, email, and phone number,
 * then hashes the password and saves the new user in the database.
 */
exports.register = async (req, res) => {
  const { username, displayname, email, phone, address, password, role } = req.body;

  try {
    // Check if the username already exists
    let existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if the email is already taken
    let existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already taken' });
    }

    // Check if the phone number is already in use
    let existingNumber = await User.findOne({ where: { phone } });
    if (existingNumber) {
      return res.status(400).json({ message: 'Number already taken' });
    }

    // Hash the user's password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record in the database
    await User.create({ 
      username, 
      displayname, 
      email, 
      phone, 
      address, 
      password: hashedPassword,  // Save the hashed password
      role 
    });

    // Respond with a success message
    res.json({message: "Registered Successfully!"});
  } catch (err) {
    console.log(err);
    // Return a generic error message if something goes wrong
    res.status(500).json({ message: 'Error creating user' });
  }
};

/**
 * User login controller
 * Logs in a user by verifying the credentials (username, email, or phone)
 * and password, then generates a JWT token upon successful authentication.
 */
exports.login = async (req, res) => {
  const { identifier, password } = req.body;  // 'identifier' can be username, email, or phone

  try {
    // Find a user by username, email, or phone using Sequelize's Op.or operator
    const user = await User.findOne({
      where: {
        [Op.or]: {
          username: identifier,
          email: identifier,
          phone: identifier
        }
      }
    });

    // Check if user exists and the password is valid
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token for the user, valid for 1 hour
    const token = jwt.sign(
      { username: user.username },  // Payload containing the username
      process.env.JWT_SECRET,       // Secret key from environment variables
      { expiresIn: '1h' }           // Token expiration time
    );

    // Respond with the JWT token and a success message
    res.json({ token, message: "Logged in successfully" });
  } catch (err) {
    console.log(err);
    // Return a generic error message if something goes wrong
    res.status(500).json({ message: 'Error logging in' });
  }
};
