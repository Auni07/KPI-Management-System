const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');  


router.get('/departments', userController.getUniqueDepartments);


router.get('/staff', protect, userController.getAllStaff);


router.get('/profile', protect, userController.getUserProfile);

router.put('/profile', protect, userController.updateUser);


router.put('/change-password', protect, userController.changePassword);

router.delete('/delete-staff/:id', protect, userController.deleteStaffAccount);


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get("/users/email/:email", protect, userController.getUserByEmail);
router.delete("/delete-account", protect, userController.deleteAccount);



module.exports = router;
