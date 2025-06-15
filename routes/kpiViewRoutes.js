const express = require('express');
const router = express.Router();
const kpiController = require('../controllers/kpiManagerController');

// All API routes for KPIs here
router.get('/', kpiController.getKpis);       // GET /api/kpis/
router.post('/', kpiController.createKpi);    // POST /api/kpis/
router.get('/:id', kpiController.getKpiById); // GET /api/kpis/:id
router.put('/:id', kpiController.updateKpi);  // PUT /api/kpis/:id

module.exports = router;