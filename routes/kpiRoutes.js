
const kpiController = require('../controllers/kpiController');
const express = require('express');
const router = express.Router();
const Kpi = require('../models/kpi'); // Make sure path is correct

// GET KPI by ID
router.get('/:id', async (req, res) => {
  try {
    const kpi = await Kpi.findById(req.params.id).populate('assignedTo', 'name email');
    if (!kpi) {
      return res.status(404).json({ message: 'KPI not found' });
    }
    res.json(kpi);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update KPI by ID
router.put('/:id', async (req, res) => {
  try {
    // Find and update the KPI by id, returning the updated document
    const updatedKPI = await Kpi.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedKPI) {
      return res.status(404).json({ message: 'KPI not found' });
    }

    res.json(updatedKPI);
  } catch (error) {
    console.error('Error updating KPI:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// NEW: GET all KPIs with optional filters (delegated to controller) FOR VIEW ASSIGNED KPI MANAGER
router.get('/', kpiController.getKpis);

// NEW: POST create a new KPI (delegated to controller)
router.post('/', kpiController.createKpi);

// NEW: DELETE a KPI by ID (delegated to controller)
router.delete('/:id', kpiController.deleteKpi);

module.exports = router;
