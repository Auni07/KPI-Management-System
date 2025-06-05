// controllers/kpiController.js
const Kpi = require('../models/kpi');
const User = require('../models/user');
const mongoose = require('mongoose'); // <--- Ensure this line is present at the top

// ... (other functions like getKpiById, createKpi, updateKpi, deleteKpi) ...

// @route   GET /api/kpis
// @desc    Get all KPIs with optional filters (assignedTo (user _id or name), department, status (approvalstat))
// @access  Public
exports.getKpis = async (req, res) => {
  try {
    const { staffName, department, status } = req.query;
    const query = {}; // Initialize the query object

    // Filter by assignedTo (now handles both ID and Name gracefully)
    if (staffName) {
      // Check if the provided staffName is a valid ObjectId format
      if (!mongoose.Types.ObjectId.isValid(staffName)) {
        // If it's NOT a valid ObjectId, assume it's a staff name string
        const staffUser = await User.findOne({ name: new RegExp(staffName, 'i') }).select('_id');
        if (staffUser) {
          query.assignedTo = staffUser._id; // Use the found user's _id
        } else {
          // If no user found with that name, no KPIs will match
          return res.json([]);
        }
      } else {
        // If it IS a valid ObjectId, use it directly
        query.assignedTo = staffName;
      }
    }

    // Filter by Approval Status (which frontend calls 'status')
    if (status) {
      query.approvalstat = new RegExp(status, 'i'); // Case-insensitive match for approvalstat
    }

    // --- Start of FIX for 'kpis' declaration ---
    let kpis; // Declared once with 'let' at the top of the scope

    // Handle Department Filter
    if (department) {
      // Find all users belonging to the specified department
      const departmentUsers = await User.find({ department: new RegExp(department, 'i') }).select('_id');

      if (departmentUsers.length === 0) {
        return res.json([]); // No users in this department, so no KPIs will match
      }

      const departmentUserIds = departmentUsers.map(user => user._id);

      // If assignedTo is already in the query (from staffName filter),
      // we need to check if that specific staff member is in the department.
      if (query.assignedTo) {
        // query.assignedTo might be an ObjectId, so convert it to string for comparison with array of ObjectIds
        // Use .some() for checking if query.assignedTo exists in departmentUserIds
        if (!departmentUserIds.some(id => id.equals(query.assignedTo))) { // .equals() is safer for ObjectIds
          return res.json([]); // Specific staff member is not in the filtered department
        }
        // If they are, query.assignedTo remains as is (already filtered for that specific staff)
      } else {
        // If no staffName filter, then filter by all KPIs assigned to users in the specified department
        query.assignedTo = { $in: departmentUserIds };
      }
      // Now, assign value to kpis without 'const' or 'let'
      kpis = await Kpi.find(query).populate('assignedTo', 'name email department');

    } else {
      // If no department filter, simply find KPIs based on other filters
      // Assign value to kpis without 'const' or 'let'
      kpis = await Kpi.find(query).populate('assignedTo', 'name email department');
    }
    // --- End of FIX for 'kpis' declaration ---

    res.json(kpis);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
//CRUD PART


// @route   GET /api/kpis/:id
// @desc    Get single KPI by ID
// @access  Public
exports.getKpiById = async (req, res) => {
  try {
    const kpi = await Kpi.findById(req.params.id).populate('assignedTo', 'name email department'); // Populate user details
    if (!kpi) {
      return res.status(404).json({ msg: 'KPI not found' });
    }
    res.json(kpi);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid KPI ID' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   POST /api/kpis
// @desc    Create a new KPI
// @access  Public
exports.createKpi = async (req, res) => {
  const {
    title,
    description,
    target, // From your schema
    targetValue,
    progress, // From your schema
    progressNumber,
    startDate,
    dueDate,
    status, // Maps to schema's 'status' (progress status)
    approvalstat, // Maps to schema's 'approvalstat'
    assignedTo // This should be the User's _id
  } = req.body;

  try {
    const newKpi = new Kpi({
      title,
      description,
      target,
      targetValue,
      progress,
      progressNumber,
      startDate,
      dueDate,
      status, // Progress Status (Not Started, In Progress, Completed)
      approvalstat, // Approval Status (Pending Approval, Approved, Rejected, No New Progress)
      assignedTo // User's ObjectId
    });

    const kpi = await newKpi.save();
    res.status(201).json(kpi);
  } catch (err) {
    console.error(err.message);
    // Add validation error details if available from Mongoose
    if (err.name === 'ValidationError') {
      let errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ msg: 'Validation Error', errors });
    }
    res.status(500).send('Server Error');
  }
};

// @route   PUT /api/kpis/:id
// @desc    Update a KPI
// @access  Public
exports.updateKpi = async (req, res) => {
  const {
    title,
    description,
    target,
    targetValue,
    progress,
    progressNumber,
    startDate,
    dueDate,
    status, // Progress status
    approvalstat, // Approval status
    assignedTo // Can be updated, but usually doesn't change
  } = req.body;

  try {
    let kpi = await Kpi.findById(req.params.id);

    if (!kpi) {
      return res.status(404).json({ msg: 'KPI not found' });
    }

    // Update KPI fields dynamically if they exist in req.body
    kpi.title = title !== undefined ? title : kpi.title;
    kpi.description = description !== undefined ? description : kpi.description;
    kpi.target = target !== undefined ? target : kpi.target;
    kpi.targetValue = targetValue !== undefined ? targetValue : kpi.targetValue;
    kpi.progress = progress !== undefined ? progress : kpi.progress;
    kpi.progressNumber = progressNumber !== undefined ? progressNumber : kpi.progressNumber;
    kpi.startDate = startDate !== undefined ? startDate : kpi.startDate;
    kpi.dueDate = dueDate !== undefined ? dueDate : kpi.dueDate;
    kpi.status = status !== undefined ? status : kpi.status; // Progress status
    kpi.approvalstat = approvalstat !== undefined ? approvalstat : kpi.approvalstat; // Approval status
    kpi.assignedTo = assignedTo !== undefined ? assignedTo : kpi.assignedTo;

    await kpi.save();
    res.json(kpi);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      let errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ msg: 'Validation Error', errors });
    }
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid KPI ID' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   DELETE /api/kpis/:id
// @desc    Delete a KPI
// @access  Public
exports.deleteKpi = async (req, res) => {
  try {
    const kpi = await Kpi.findById(req.params.id);
    if (!kpi) {
      return res.status(404).json({ msg: 'KPI not found' });
    }

    await Kpi.deleteOne({ _id: req.params.id });
    res.json({ msg: 'KPI removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid KPI ID' });
    }
    res.status(500).send('Server Error');
  }
};