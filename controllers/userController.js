// controllers/userController.js
const User = require('../models/user');

// @route   GET /api/departments
// @desc    Get unique departments from users
// @access  Public (for now, can add auth later)
exports.getUniqueDepartments = async (req, res) => {
  try {
    // Find all users who have a department field that is not null or an empty string
    // and then extract only the unique department values.
    const departments = await User.distinct('department', {
      department: { $ne: null, $ne: '' } // Exclude null and empty strings
    });
    // Optional: Sort departments alphabetically
    res.json(departments.sort());
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ... (getAllStaff function remains the same) ...
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('_id name email department');
    res.json(staff);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};