const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');  // 引入身份验证中间件

// 公开路由：获取唯一部门
router.get('/departments', userController.getUniqueDepartments);

// 保护路由：获取所有 Staff 用户（只有已认证的用户可以访问）
router.get('/staff', protect, userController.getAllStaff);

// 保护路由：获取用户资料
router.get('/profile', protect, userController.getUserProfile);

// 保护路由：更新用户资料
router.put('/profile', protect, userController.updateUser);

// 保护路由：修改密码
router.put('/change-password', protect, userController.changePassword);



// 保护路由：删除 Staff 账户（只有 Manager 可以删除）
router.delete('/delete-staff/:id', protect, userController.deleteStaffAccount);

// 注册和登录路由（公开）
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
