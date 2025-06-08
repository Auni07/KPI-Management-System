// kpiStaffRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer"); // Middleware for handling file uploads
const path = require("path"); // <--- ADDED: Import the path module
const kpiStaffController = require("../controllers/kpiStaffController"); // Import the KPI controller

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure this directory exists! This directory must be created manually or programmatically.
    // E.g., at your project root, create a folder 'uploads', and inside it 'kpi_evidence'.
    cb(null, "uploads/kpi_evidence/");
  },
  filename: function (req, file, cb) {
    // Example: kpiId-timestamp-originalfilename.ext
    // req.params.id is available here because this storage config is used with a route like /update/:id
    const kpiId = req.params.id;
    const timestamp = Date.now();
    const originalExtension = path.extname(file.originalname);
    cb(null, `${kpiId}-${timestamp}${originalExtension}`);
  },
});
const upload = multer({ storage: storage });

// --- HTML Rendering Routes (Sending static HTML files) ---

// GET route to view KPIs assigned to the logged-in staff.
router.get("/view", kpiStaffController.viewKpisHtml);

// GET route to render the KPI update form for a specific KPI ID.
// This route sends the 'staff-kpi-detail.html' file (as per your prompt).
router.get("/update/:id", kpiStaffController.getKpiUpdateFormHtml);

// POST route to handle KPI progress updates.
// 'upload.single("fileUpload")' is Multer middleware that processes a single
// file upload with the field name "fileUpload". The file information
// will be available in 'req.file' in the kpiStaffController.updateKpiProgress function.
router.post(
  "/update/:id",
  upload.single("fileUpload"),
  kpiStaffController.updateKpiProgress
);

// --- API Routes (Returning JSON data) ---

// API GET route to fetch a list of all KPIs assigned to the logged-in user.
router.get("/api/kpi-staff", kpiStaffController.getAssignedKpisApi);

// API GET route to fetch details of a specific KPI by its ID.
router.get("/api/kpi-staff/:id", kpiStaffController.getSpecificKpiApi);

module.exports = router;
