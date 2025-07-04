const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @route   POST /api/register
// @desc    Register a new user
// @access  Public
// @route   POST /api/register
// @desc    Register a new user
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password, role, department, phone, managerEmail } =
    req.body;

  if (!name || !email || !password || !role || !department) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let manager = null;

    // 2. If registering a Staff, assign to the manager by email
    if (role === "Staff") {
      if (!managerEmail) {
        return res
          .status(400)
          .json({ message: "You must provide your manager's email" });
      }
      manager = await User.findOne({ email: managerEmail, role: "Manager" });
      if (!manager) {
        return res
          .status(400)
          .json({ message: "Manager not found with this email" });
      }
    }

    // 3. Create and save the user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      phone,
      manager: manager ? manager._id : null,
    });

    await user.save();

    const token = user.generateAuthToken();
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message || "Server Error" });
  }
};

// @route   POST /api/login
// @desc    Login user and get token
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({
        message: `Role mismatch: your account is registered as "${user.role}"`,
      });
    }

    const token = user.generateAuthToken();
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    req.session.user = userWithoutPassword;

    res.status(200).json({
      token,
      user: userWithoutPassword,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET /api/profile
// @desc    Get the profile of the logged-in user
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let manager = null;
    let staffList = [];

    if (user.role === "Staff") {
      manager = await User.findById(user.manager).select("name");
    }

    if (user.role === "Manager") {
      staffList = await User.find({
        role: "Staff",
        manager: user._id,
      }).select("name");
    }

    res.status(200).json({
      ...user._doc,
      manager,
      staffList,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   PUT /api/profile
// @desc    Update the profile of the logged-in user
// @access  Private
exports.updateUser = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   PUT /api/change-password
// @desc    Change the password of the logged-in user
// @access  Private
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @route   DELETE /api/delete-staff/:id
// @desc    Delete a staff account (only Manager can delete)
// @access  Private (Manager only)
exports.deleteStaffAccount = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role !== "Manager") {
      return res.status(403).json({
        message: "Permission denied. Only Managers can delete Staff accounts.",
      });
    }

    if (userToDelete._id.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account." });
    }

    await userToDelete.deleteOne();
    res.status(200).json({ message: "Staff account deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET /api/departments
// @desc    Get unique departments from users
// @access  Public
exports.getUniqueDepartments = async (req, res) => {
  try {
    const departments = await User.distinct("department", {
      department: { $nin: [null, ""] },
    });
    res.json(departments.sort());
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET /api/staff
// @desc    Get all staff
// @access  Private (Manager or Admin only)
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: "Staff" }).select(
      "_id name email department"
    );
    res.json(staff);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.status(200).json({ message: "Your account has been deleted" });
  } catch (err) {
    console.error("Delete self error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteStaffAccount = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    if (staff._id.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "Use /delete-account to delete your own account" });
    }

    await staff.deleteOne();
    res.status(200).json({ message: "Staff account deleted successfully" });
  } catch (err) {
    console.error("Delete staff error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
