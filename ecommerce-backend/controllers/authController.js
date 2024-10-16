const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Op } = require("sequelize");

exports.register = async (req, res) => {
  const { username, displayname, email, phone, address, password, role } = req.body;

  try {
    let existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    let existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already taken' });
    }
    let existingNumber = await User.findOne({ where: { phone } });
    if (existingNumber) {
      return res.status(400).json({ message: 'Number already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, displayname, email, phone, address, password: hashedPassword, role });
    res.json({message: "Registered Successfully!"});
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error creating user' });
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: {
          username: identifier,
          email: identifier,
          phone: identifier
        }
      }
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: "Logged in successfully" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error logging in' });
  }
};