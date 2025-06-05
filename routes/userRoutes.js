// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route for unique departments
router.get('/departments', userController.getUniqueDepartments);

// Route for all staff
router.get('/staff', userController.getAllStaff);

module.exports = router;
