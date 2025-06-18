const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const KPI = require('../models/kpi');

// GET route to fetch KPIs assigned to current user
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { start, end } = req.query;
    const query = {
      assignedTo: userId,
    };
    if (start && end) {
      query.dueDate = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }
    const kpis = await KPI.find(query).populate('assignedTo', 'name');
    res.json({ kpis });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;