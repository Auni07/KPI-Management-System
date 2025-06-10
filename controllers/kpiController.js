// controllers/kpiController.js
const Kpi = require('../models/kpi');
const User = require('../models/user');
const mongoose = require('mongoose');


exports.viewManagerKpisHtml = async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.redirect("/login"); // Redirect to login if not authenticated
    }

    const filePath = path.join(
      __dirname,
      "..",
      "frontend",
      "pages",
      "manager-view-assigned-kpi.html"
    );

    await fs.access(filePath); // Check if file exists
    res.sendFile(filePath); // Send the HTML file
  } catch (err) {
    console.error("Error in viewManagerKpisHtml:", err); // Corrected function name
    if (err.code === "ENOENT") {
      return res.status(404).send("View page not found.");
    }
    res.status(500).send("Server Error loading KPI view.");
  }
};

exports.viewManagerAssignKpiHtml = async (req, res) => {
  try {
    // Check if user is logged in
    // Assuming 'req.session.user' is how you track authenticated users.
    if (!req.session.user) {
      // Redirect to login page if not authenticated
      return res.redirect("/login");
    }

    // Construct the file path to the manager-assign-kpi.html file.
    // It's assumed that this controller file is in 'controllers' directory
    // and 'manager-assign-kpi.html' is in 'frontend/pages'.
    const filePath = path.join(
      __dirname,
      "..", // Go up from 'controllers' to the project root
      "frontend",
      "pages",
      "manager-assign-kpi.html"
    );

    // Check if the file exists and is accessible.
    // This helps catch file not found errors before attempting to send it.
    await fs.access(filePath);

    // Send the HTML file to the client.
    res.sendFile(filePath);
  } catch (err) {
    // Log the error for debugging purposes.
    console.error("Error in viewManagerAssignKpiHtml:", err);

    // Handle specific error codes, like file not found.
    if (err.code === "ENOENT") {
      return res.status(404).send("Manager Assign KPI page not found.");
    }

    // Handle any other server errors.
    res.status(500).send("Server Error loading Manager Assign KPI view.");
  }
};

// @route   GET /api/kpis
// @desc    Get all KPIs with optional filters (staffName, department, status)
// @access  Public
exports.getKpis = async (req, res) => {
  try {
    const { staffName, department, status } = req.query;
    const query = {};

    if (staffName) {
      if (!mongoose.Types.ObjectId.isValid(staffName)) {
        const staffUser = await User.findOne({ name: new RegExp(staffName, 'i') }).select('_id');
        if (staffUser) {
          query.assignedTo = staffUser._id;
        } else {
          return res.json([]);
        }
      } else {
        query.assignedTo = staffName;
      }
    }

    if (status) {
      query.approvalstat = new RegExp(status, 'i');
    }

    let kpis;
    if (department) {
      const departmentUsers = await User.find({ department: new RegExp(department, 'i') }).select('_id');
      if (departmentUsers.length === 0) return res.json([]);
      const departmentUserIds = departmentUsers.map(user => user._id);

      if (query.assignedTo) {
        if (!departmentUserIds.some(id => id.equals(query.assignedTo))) {
          return res.json([]);
        }
      } else {
        query.assignedTo = { $in: departmentUserIds };
      }
    }

    kpis = await Kpi.find(query).populate('assignedTo', 'name email department');
    res.json(kpis);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET /api/kpis/:id
// @desc    Get KPI by ID
// @access  Public
exports.getKpiById = async (req, res) => {
  try {
    const kpi = await Kpi.findById(req.params.id).populate('assignedTo', 'name email department');
    if (!kpi) return res.status(404).json({ msg: 'KPI not found' });
    res.json(kpi);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(400).json({ msg: 'KPI not found (Invalid ID format)' });
    res.status(500).send('Server Error');
  }
};

// @route   POST /api/kpis
// @desc    Create a new KPI
// @access  Manager
exports.createKpi = async (req, res) => {
  const { title, description, staffName, targetValue, department, dueDate, performanceIndicator } = req.body;

  try {
    const assignedStaff = await User.findOne({ name: new RegExp(staffName, 'i'), role: 'staff' });

    if (!assignedStaff) {
      return res.status(404).json({ msg: 'Assigned staff member not found' });
    }

    const newKpi = new Kpi({
      title,
      description,
      target: performanceIndicator,
      targetValue,
      dueDate: new Date(dueDate),
      assignedTo: assignedStaff._id,
      status: 'Not Started',
      progressNumber: 0,
      approvalstat: 'Pending',
    });

    const kpi = await newKpi.save();
    res.status(201).json(kpi);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ msg: `Validation Error: ${messages.join(', ')}` });
    }
    res.status(500).send('Server Error during KPI creation');
  }
};

// @route   PUT /api/kpis/:id
// @desc    Update a KPI by ID
// @access  Manager
exports.updateKpi = async (req, res) => {
  const { title, description, staffName, targetValue, dueDate, performanceIndicator, status, progressNumber, approvalstat, evidence } = req.body;

  try {
    let kpi = await Kpi.findById(req.params.id);
    if (!kpi) return res.status(404).json({ msg: 'KPI not found' });

    if (staffName) {
      const newAssignedStaff = await User.findOne({ name: new RegExp(staffName, 'i'), role: 'staff' });
      if (!newAssignedStaff) return res.status(404).json({ msg: 'New assigned staff member not found' });
      kpi.assignedTo = newAssignedStaff._id;
    }

    if (title) kpi.title = title;
    if (description) kpi.description = description;
    if (targetValue) kpi.targetValue = targetValue;
    if (dueDate) kpi.dueDate = new Date(dueDate);
    if (performanceIndicator) kpi.target = performanceIndicator;
    if (status) kpi.status = status;
    if (typeof progressNumber !== 'undefined') kpi.progressNumber = progressNumber;
    if (approvalstat) kpi.approvalstat = approvalstat;
    if (evidence) kpi.evidence = evidence;

    await kpi.save();
    res.json(kpi);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(400).json({ msg: 'KPI not found (Invalid ID format)' });
    res.status(500).send('Server Error');
  }
};

// @route   DELETE /api/kpis/:id
// @desc    Delete a KPI by ID
// @access  Manager
exports.deleteKpi = async (req, res) => {
  try {
    const kpi = await Kpi.findByIdAndDelete(req.params.id);
    if (!kpi) return res.status(404).json({ msg: 'KPI not found' });
    res.json({ msg: 'KPI removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(400).json({ msg: 'KPI not found (Invalid ID format)' });
    res.status(500).send('Server Error');
  }
};