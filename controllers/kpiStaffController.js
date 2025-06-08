// kpiStaffController.js
const KPI = require("../models/kpi"); // KPI mongoose model
const User = require("../models/user"); // User mongoose model
const path = require("path"); // Node.js path module for file paths
const fs = require("fs").promises; // Node.js file system module (promises for async operations)

// No need for multer configuration here as it's handled in kpiStaffRoutes.js
// The req.file object will be populated by the Multer middleware in the route.

// --- HTML Rendering Routes ---

/**
 * Renders the staff KPI view page.
 * Fetches KPIs assigned to the logged-in user and user details.
 * Sends the 'staff-kpi-view.html' file.
 */
exports.viewKpisHtml = async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.redirect("/login"); // Redirect to login if not authenticated
    }

    const userId = req.session.user._id;

    // Fetch KPIs assigned to the user
    // Note: For actual rendering with data, you'd typically use a templating engine
    // or send JSON and let client-side JS render it. This serves the static HTML.
    const kpis = await KPI.find({ assignedTo: userId }).lean();
    const user = await User.findById(userId).populate("manager").lean();

    const filePath = path.join(__dirname, "..", "frontend", "pages", "staff-view-kpi.html");
    await fs.access(filePath); // Check if file exists
    res.sendFile(filePath); // Send the HTML file
  } catch (err) {
    console.error("Error in viewKpisHtml:", err);
    if (err.code === "ENOENT") {
      return res.status(404).send("View page not found.");
    }
    res.status(500).send("Server Error loading KPI view.");
  }
};

/**
 * Renders the KPI update form page for a specific KPI.
 * Sends the 'staff-kpi-detail.html' file.
 */
exports.getKpiUpdateFormHtml = async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.redirect("/login"); // Redirect to login if not authenticated
    }

    // Serve the HTML file that will then fetch KPI data via an API call
    const filePath = path.join(__dirname, "..", "frontend", "pages", "staff-kpi-detail.html");
    await fs.access(filePath); // Check if file exists
    res.sendFile(filePath); // Send the HTML file
  } catch (err) {
    console.error("Error in getKpiUpdateFormHtml:", err);
    if (err.code === "ENOENT") {
      return res.status(404).send("Update page not found.");
    }
    res.status(500).send("Server error loading KPI update form.");
  }
};

/**
 * Handles the POST request to update KPI progress.
 * This route expects a file upload and updates the KPI document in the database.
 */
exports.updateKpiProgress = async (req, res) => {
  const kpiId = req.params.id;
  const { progressInput, progressNote, fileNote } = req.body;
  // Multer populates req.file after processing the upload
  const filePath = req.file ? req.file.path : null;

  try {
    // Find the KPI to get its current targetValue
    const kpi = await KPI.findById(kpiId);
    if (!kpi) {
      // If KPI not found, respond with 404 and remove any uploaded file
      if (filePath) {
        await fs.unlink(filePath).catch(fileErr => console.error("Error deleting temp file:", fileErr));
      }
      return res.status(404).json({ message: "KPI not found." });
    }

    // Check if the KPI is assigned to the logged-in user for security
    if (kpi.assignedTo.toString() !== req.session.user._id.toString()) {
      // If forbidden, respond with 403 and remove any uploaded file
      if (filePath) {
        await fs.unlink(filePath).catch(fileErr => console.error("Error deleting temp file:", fileErr));
      }
      return res.status(403).json({ message: "Forbidden: You do not have permission to update this KPI." });
    }

    let newProgressNumber = kpi.progressNumber;
    let newStatus = kpi.status;
    const newProgressString = progressInput; // Store the raw input string

    // Attempt to parse numerical progress for comparison against targetValue
    const parsedProgressValue = parseFloat(progressInput);
    if (!isNaN(parsedProgressValue)) {
      newProgressNumber = parsedProgressValue;
    }

    // Update status based on progress and target
    if (newProgressNumber >= kpi.targetValue && kpi.targetValue > 0) {
      newStatus = "Completed";
    } else if (newProgressNumber > 0 && newProgressNumber < kpi.targetValue) {
      newStatus = "In Progress";
    } else {
      newStatus = "Not Started"; // Fallback, or keep current if 0 progress
    }

    // Create the new progress update entry
    const newProgressUpdate = {
      progressInput: newProgressString, // Store the user's string input (e.g., "50%")
      progressNote: progressNote,
      file: {
        filePath: filePath, // Path to the uploaded file
        fileNote: fileNote,
      },
      createdAt: new Date(),
    };

    // Update the KPI document in the database
    await KPI.findByIdAndUpdate(
      kpiId,
      {
        $push: {
          progressUpdates: newProgressUpdate, // Add the new update to the array
        },
        $set: {
          progress: newProgressString, // Update the main progress string
          progressNumber: newProgressNumber, // Update the main numerical progress
          status: newStatus, // Update the KPI status
          approvalstat: "Pending", // Set approval status to 'Pending'
        },
      },
      { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators: true` ensures schema validations run
    );

    res.status(200).json({ message: "KPI progress updated successfully and pending approval." });
  } catch (err) {
    console.error("Error updating KPI progress:", err);
    // Remove the uploaded file if a server error occurred during DB update
    if (filePath) {
      await fs.unlink(filePath).catch(fileErr => console.error("Error deleting uploaded file:", fileErr));
    }
    // Differentiate between Mongoose validation errors or other server errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation error: " + err.message, error: err });
    } else if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid KPI ID format.", error: err });
    }
    res.status(500).json({ message: "Update failed. Please try again.", error: err.message });
  }
};

// --- API Routes ---

/**
 * API endpoint to get a list of all KPIs assigned to the logged-in user.
 * Responds with JSON data.
 */
exports.getAssignedKpisApi = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in." });
    }

    const userId = req.session.user._id;
    const kpis = await KPI.find({ assignedTo: userId }).lean();
    res.json({ kpis: kpis });
  } catch (err) {
    console.error("Error fetching assigned KPIs API:", err);
    res.status(500).json({ message: "Server error fetching KPIs." });
  }
};

/**
 * API endpoint to get details of a specific KPI by its ID.
 * Responds with JSON data.
 */
exports.getSpecificKpiApi = async (req, res) => {
  const kpiId = req.params.id;

  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in." });
    }

    const kpi = await KPI.findById(kpiId).lean();

    if (!kpi) {
      return res.status(404).json({ message: "KPI not found." });
    }

    // Security check: Ensure the KPI belongs to the logged-in user
    if (kpi.assignedTo.toString() !== req.session.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not have access to this KPI." });
    }

    res.json({ kpi: kpi });
  } catch (err) {
    console.error("Error fetching specific KPI API:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid KPI ID format." });
    }
    res.status(500).json({ message: "Server error fetching KPI details." });
  }
};