// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');


// Protect route middleware to authenticate user
const protect = async (req, res, next) => {
  let token;

  // 检查请求头是否有 Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 从请求头中获取 token
      token = req.headers.authorization.split(' ')[1];
      // 使用 JWT 验证 token
      const decoded = jwt.verify(token, 'your_jwt_secret');

      // 将用户信息添加到请求中，供后续使用
      req.user = await User.findById(decoded.id);
      next();
    } catch (err) {
      console.error(err.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // 如果没有 token
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
