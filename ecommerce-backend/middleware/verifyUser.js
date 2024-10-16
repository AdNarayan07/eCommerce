const verifyUser = (req, res, next) => {
  if (req.user && req.user.username && req.body && req.body.username) {
    if (req.user.username === req.body.username) {
      next(); // User is verified, proceed to the next middleware or route handler
    } else {
      res.status(403).json({ message: "Access Denied" }); // Forbidden
    }
  } else {
    res.status(400).json({ message: "Bad Request: Missing required user information" }); // Handle missing data
  }
};

module.exports = verifyUser;
