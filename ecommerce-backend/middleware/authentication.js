const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library for handling JWTs
const User = require('../models/user'); // Import the User model to interact with user data

// Middleware function to authenticate users based on JWT
const authentication = async (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log(token); // Log the token for debugging purposes

  // If no token is provided, deny access
  if (!token) {
    return res.status(401).json({ message: 'Access Denied' }); // 401 Unauthorized
  }

  try {
    // Verify the token using the secret stored in environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user associated with the decoded token (username) and exclude the password from the result
    const user = await User.findByPk(decoded.username, { attributes: { exclude: ['password'] } });
    
    // Attach the user data to the request object for use in the next middleware or route handler
    req.user = user.dataValues;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.log(err); // Log any error that occurs during verification
    res.status(498).json({ message: 'Invalid Token' }); // 498 Invalid Token
  }
};

module.exports = authentication; // Export the authentication middleware
