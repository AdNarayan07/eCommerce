const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authentication = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.username, { attributes: { exclude: ['password'] } });
    req.user = user.dataValues;

    next();
  } catch (err) {
    console.log(err)
    res.status(498).json({ message: 'Invalid Token' });
  }
};

module.exports = authentication;