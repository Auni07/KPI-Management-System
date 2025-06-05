const express = require("express");
const router = express.Router();
const multer = require("multer");
const KPI = require("../models/kpi"); // KPI mongoose model
const User = require("../models/user"); // User mongoose model

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// GET route to view KPIs assigned to the logged-in staff
router.get("/view", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const userId = req.session.user._id;
    const kpis = await KPI.find({ assignedTo: userId });
    const user = await User.findById(userId).populate("manager");

    res.render("staff-kpi-view", { kpis, user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET route to render KPI update form
router.get("/update/:id", async (req, res) => {
  const kpiId = req.params.id;

  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const kpi = await KPI.findById(kpiId);
    if (!kpi) {
      return res.status(404).send("KPI not found");
    }

    res.render("staff-kpi-update", { kpi });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST route to handle KPI progress update
router.post("/update/:id", upload.single("fileUpload"), async (req, res) => {
  const kpiId = req.params.id;
  const { progressInput, progressNote, fileNote } = req.body;
  const filePath = req.file ? req.file.path : null;

  try {
    await KPI.findByIdAndUpdate(kpiId, {
      $push: {
        progressUpdates: {
          progressInput,
          progressNote,
          file: {
            filePath,
            fileNote,
          },
          createdAt: new Date(),
        },
      },
      $set: {
        approvalstat: "Pending Approval",
      },
    });

    res.redirect("/kpi/view");
  } catch (err) {
    console.error(err);
    res.status(500).send("Update failed");
  }
});

module.exports = router;
