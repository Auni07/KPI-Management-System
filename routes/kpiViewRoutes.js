const express = require('express');
const router = express.Router();
const kpiController = require('../controllers/kpiManagerController');

// Routes for serving HTML pages under the /manage prefix
// These routes will *render* the HTML files.
router.get('/view', kpiController.viewManagerKpisHtml); // Access: /manage/view
router.get('/assign', kpiController.viewManagerAssignKpiHtml); // Access: /manage/assign
router.get('/kpidetail', kpiController.viewManagerKpiDetailHtml); // Access: /manage/kpidetail

// All API routes for KPIs here
router.get('/', kpiController.getKpis);       // GET /api/kpis/
router.post('/', kpiController.createKpi);    // POST /api/kpis/
router.get('/:id', kpiController.getKpiById); // GET /api/kpis/:id
router.put('/:id', kpiController.updateKpi);  // PUT /api/kpis/:id


module.exports = router;