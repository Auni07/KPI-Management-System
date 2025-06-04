const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Manager dashboard
router.get('/summary', dashboardController.getKpiSummary);
router.get('/average-score-by-staff', dashboardController.getAverageScoreByStaff);

// Staff dashboard (need auth middleware for req.user)
router.get('/my-kpis', dashboardController.getMyKpis);
router.get('/my-kpi-status-summary', dashboardController.getMyKpiStatusSummary);
router.get('/my-kpi-trend', dashboardController.getMyKpiTrend);

module.exports = router;
