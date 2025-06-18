// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');


// Protect route middleware to authenticate user
const protect = async (req, res, next) => {
  let token;

  // Check if there is Bearer token in the request headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token from the authorization header
      token = req.headers.authorization.split(' ')[1];
      // Use JWT to verify the token
      const decoded = jwt.verify(token, 'your_jwt_secret');

      // Add user information to request object for further use
      req.user = await User.findById(decoded.id);
      next();
    } catch (err) {
      console.error(err.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If without token
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
