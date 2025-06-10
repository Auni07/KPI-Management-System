const kpiController = require('../controllers/kpiController');
const express = require('express');
const router = express.Router();
const Kpi = require('../models/kpi'); // Make sure path is correct

/* GET KPI by ID
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
});*/

// HTML View Route (Most Specific)
router.get("/view", kpiController.viewManagerKpisHtml);
// HTML Assign Route (Most Specific)
router.get("/assign", kpiController.viewManagerAssignKpiHtml);

// API Endpoint for Manager's KPI Data (More Specific than ':id')
router.get("/kpidata", kpiController.getKpis); // This is what the frontend should call

// NEW: GET all KPIs with optional filters (delegated to controller) FOR VIEW ASSIGNED AND ASSIGNKPI MANAGER
router.get('/', kpiController.getKpis);
router.post('/', kpiController.createKpi); // POST new KPI

router.get('/:id', kpiController.getKpiById); // GET KPI by ID
router.put('/:id', kpiController.updateKpi); // UPDATE KPI by ID
router.delete('/:id', kpiController.deleteKpi); // DELETE KPI by ID

module.exports = router;