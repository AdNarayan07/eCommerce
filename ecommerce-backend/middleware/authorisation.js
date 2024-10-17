// Middleware function to check user roles for authorization
const authorisation = (roles) => {
  // The actual middleware function that will be called for each request
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      // If the user's role is not authorized, send a 403 Forbidden response
      return res.status(403).json({ message: 'Permission Denied' }); // 403 Forbidden
    }
    // If the user is authorized, proceed to the next middleware or route handler
    next();
  };
};

module.exports = authorisation; // Export the authorisation middleware
