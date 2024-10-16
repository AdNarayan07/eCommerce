const authorisation = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Permission Denied' });
      }
      next();
    };
  };
  
  module.exports = authorisation;