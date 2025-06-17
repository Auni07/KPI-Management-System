// kpiStaffController.js
const KPI = require("../models/kpi"); // KPI mongoose model
const User = require("../models/user"); // User mongoose model
const path = require("path"); // Node.js path module for file paths
const fs = require("fs").promises; // Node.js file system module (promises for async operations)

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
    const kpis = await KPI.find({ assignedTo: userId }).lean();
    const user = await User.findById(userId).populate("manager").lean();

    const filePath = path.join(
      __dirname,
      "..",
      "frontend",
      "pages",
      "staff-view-kpi.html"
    );
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
    const filePath = path.join(
      __dirname,
      "..",
      "frontend",
      "pages",
      "staff-kpi-detail.html"
    );
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
  const { progressInput, progressNumberInput, progressNote, fileNote } = req.body;
  const filePath = req.file ? req.file.path : null;

  try {
    const kpi = await KPI.findById(kpiId);
    if (!kpi) {
      if (filePath) {
        await fs
          .unlink(filePath)
          .catch((fileErr) =>
            console.error("Error deleting temp file:", fileErr)
          );
      }
      return res.status(404).json({ message: "KPI not found." });
    }

    if (kpi.assignedTo.toString() !== req.session.user._id.toString()) {
      if (filePath) {
        await fs
          .unlink(filePath)
          .catch((fileErr) =>
            console.error("Error deleting temp file:", fileErr)
          );
      }
      return res
        .status(403)
        .json({
          message: "Forbidden: You do not have permission to update this KPI.",
        });
    }

    // Calculate the new progress number by adding to the current progress
    const addedProgress = parseFloat(progressNumberInput);

    if (isNaN(addedProgress) || addedProgress < 0) {
      if (filePath) {
        await fs
          .unlink(filePath)
          .catch((fileErr) =>
            console.error("Error deleting temp file:", fileErr)
          );
      }
      return res.status(400).json({ message: "Invalid numerical progress value. Must be a non-negative number to add." });
    }

    let newProgressNumber = (kpi.progressNumber || 0) + addedProgress;

    // Ensure progressNumber does not exceed targetValue
    if (kpi.targetValue && kpi.targetValue > 0 && newProgressNumber > kpi.targetValue) {
        newProgressNumber = kpi.targetValue;
    }


    let newStatus = kpi.status; // Initialize with current status
    let newApprovalStat = kpi.approvalstat; // Initialize with current approval status

    // Logic for setting KPI status based on progress
    if (kpi.targetValue > 0) {
        const completionPercentage = (newProgressNumber / kpi.targetValue) * 100;

        if (completionPercentage >= 100) {
            // If numerical progress meets or exceeds target, set status to 'Completed'
            // However, the *actual* "Completed" status (for approval purposes) still depends on manager's approval
            newStatus = "Completed";
        } else if (newProgressNumber > 0) {
            newStatus = "In Progress";
        } else {
            newStatus = "Not Started";
        }
    } else if (newProgressNumber > 0) {
        // For non-numerical KPIs or if targetValue is 0/N/A, and progress is made
        newStatus = "In Progress";
    } else {
        newStatus = "Not Started";
    }

    // ALWAYS set approvalstat to "Pending" when a staff member updates progress
    newApprovalStat = "Pending";

    // Create the new progress update entry
    const newProgressUpdate = {
      progressInput: progressInput,
      progressNote: progressNote,
      file: {
        filePath: filePath,
        fileNote: fileNote,
      },
      createdAt: new Date(),
    };

    // Update the KPI document in the database
    await KPI.findByIdAndUpdate(
      kpiId,
      {
        $push: {
          progressUpdates: newProgressUpdate,
        },
        $set: {
          progress: progressInput,
          progressNumber: newProgressNumber,
          status: newStatus, // This is the status based on progress, awaiting approval
          approvalstat: newApprovalStat, // Always set to Pending upon staff update
        },
      },
      { new: true, runValidators: true }
    );

    res
      .status(200)
      .json({
        message: "KPI progress updated successfully and pending approval.",
      });
  } catch (err) {
    console.error("Error updating KPI progress:", err);
    if (filePath) {
      await fs
        .unlink(filePath)
        .catch((fileErr) =>
          console.error("Error deleting uploaded file:", fileErr)
        );
    }
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error: " + err.message, error: err });
    } else if (err.name === "CastError") {
      return res
        .status(400)
        .json({ message: "Invalid KPI ID format.", error: err });
    }
    res
      .status(500)
      .json({
        message: "Update failed. Please try again.",
        error: err.message,
      });
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

    // --- IMPORTANT: Apply the "Completed" status logic here for consistency ---
    const processedKpis = kpis.map(kpi => {
        let finalStatus = kpi.status; // Start with the status determined by progress
        const completionPercentage = kpi.targetValue > 0 ? Math.min(100, (kpi.progressNumber / kpi.targetValue) * 100) : 0;

        // Override status to "Completed" ONLY if approved AND 100% complete
        if (kpi.approvalstat === 'Approved' && completionPercentage === 100) {
            finalStatus = 'Completed';
        } else if (finalStatus === 'Completed' && !(kpi.approvalstat === 'Approved' && completionPercentage === 100)) {
            // This case handles a KPI that was previously "Completed"
            // (e.g., approved and 100%) but then its approval status changed
            // or its progress decreased (if that's possible).
            // It reverts the *display* status if criteria are no longer met.
            if (kpi.progressNumber > 0) {
                finalStatus = 'In Progress';
            } else {
                finalStatus = 'Not Started';
            }
        }

        return {
            ...kpi, // Return all existing KPI fields
            status: finalStatus // Override the status with the new determined status
        };
    });

    res.json({ kpis: processedKpis });
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

    if (kpi.assignedTo.toString() !== req.session.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have access to this KPI." });
    }

    // --- Apply the "Completed" status logic here too for individual KPI detail view ---
    let finalStatus = kpi.status;
    const completionPercentage = kpi.targetValue > 0 ? Math.min(100, (kpi.progressNumber / kpi.targetValue) * 100) : 0;

    if (kpi.approvalstat === 'Approved' && completionPercentage === 100) {
        finalStatus = 'Completed';
    } else if (finalStatus === 'Completed' && !(kpi.approvalstat === 'Approved' && completionPercentage === 100)) {
        if (kpi.progressNumber > 0) {
            finalStatus = 'In Progress';
        } else {
            finalStatus = 'Not Started';
        }
    }

    // Return the KPI with the potentially adjusted status
    res.json({ kpi: { ...kpi, status: finalStatus } });
  } catch (err) {
    console.error("Error fetching specific KPI API:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid KPI ID format." });
    }
    res.status(500).json({ message: "Server error fetching KPI details." });
  }
};