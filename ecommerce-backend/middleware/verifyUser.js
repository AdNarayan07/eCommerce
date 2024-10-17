// Middleware function to verify if the user is authorized to perform an action
const verifyUser = (req, res, next) => {
  // Check if user information exists in the request
  if (req.user && req.user.username && req.body && req.body.username) {
    // If the username in the request body matches the authenticated user's username
    if (req.user.username === req.body.username) {
      next(); // User is verified, proceed to the next middleware or route handler
    } else {
      // If the usernames do not match, deny access
      res.status(403).json({ message: "Access Denied" }); // 403 Forbidden
    }
  } else {
    // If required user information is missing from the request
    res.status(400).json({ message: "Bad Request: Missing required user information" }); // Handle missing data (400 Bad Request)
  }
};

module.exports = verifyUser; // Export the verifyUser middleware
