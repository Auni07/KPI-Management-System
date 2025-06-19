// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
// Load controller
const dashboardController = require('../controllers/dashboardController');

// ================= Manager Routes =================
// Route: GET /api/dashboard/summary
// Desc: Get KPI summary for manager dashboard cards
router.get('/summary', protect,dashboardController.getKpiSummary);

// Route: GET /api/dashboard/average-score-by-staff
// Desc: Get average KPI score grouped by staff (bar chart)
router.get('/average-score-by-staff',protect, dashboardController.getAverageScoreByStaff);

// ================= Staff Routes (Protected) =================
// Route: GET /api/dashboard/my-kpis
// Desc: Get list of KPIs assigned to the current staff
router.get('/my-kpis', protect, dashboardController.getMyKpis);

// Route: GET /api/dashboard/my-kpi-status-summary
// Desc: Get KPI status counts for the current staff (pie chart)
router.get('/my-kpi-status-summary', protect, dashboardController.getMyKpiStatusSummary);

// Route: GET /api/dashboard/my-kpi-trend
// Desc: Get average KPI score per month for the current staff (line chart)
router.get('/my-kpi-trend', protect, dashboardController.getMyKpiTrend);

// Route: GET /api/dashboard/my-kpi-progress-bars
// Desc: Get progress bars for KPIs assigned to the current staff
router.get('/my-kpi-progress-bars', protect, dashboardController.getMyKpiProgressBars);

// Route: GET /api/dashboard/my-earliest-kpi
// Desc: Get earliest due KPI for the current staff
router.get('/my-earliest-kpi', protect, dashboardController.getEarliestDueKpi);


module.exports = router;
