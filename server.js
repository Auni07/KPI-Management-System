require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();
const port = process.env.PORT || 3000;
const userController = require('./controllers/userController');

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, 'frontend'))); // Serve static frontend files
app.use(express.static(path.join(__dirname, 'public'))); // Serve static public files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "pages", "dashboard.html"));
});

app.get("/kpi-management", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/user-login");
  }

  const role = req.session.user.role;
  if (role === "manager") {
    res.sendFile(path.join(__dirname, "frontend", "pages", "manager-view-assigned-kpi.html"));
  } else {
    res.sendFile(path.join(__dirname, "frontend", "pages", "staff-view-kpi.html"));
  }
});

// Models
const User = require("./models/user");
const KPI = require("./models/kpi");

// CORS middleware to allow requests from the frontend
app.use(cors({
  origin: '*',  // Allow frontend to make requests
  methods: 'GET,POST,PUT,DELETE',  // Allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization',  // Allowed headers
}));
app.use(express.json({ extended: false }));

// Connect DB - Ensure MongoDB connection is established
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/kpi_system", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

// Middleware - to serve static files and handle form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Configuration
app.use(
  session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Routes
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use("/manage", require("./routes/kpiViewRoutes"));
app.use('/api/kpis', require('./routes/kpiApiRoutes'));
app.use('/api', require('./routes/userRoutes'));

const { protect } = require('./middleware/authMiddleware');
app.use('/api/notifications', protect, require('./routes/notificationRoutes'));
const reportRoutes = require('./routes/reportRoutes');
app.use('/api/report', reportRoutes);

// Load staff KPI routes
const kpiStaffRoutes = require("./routes/kpiStaffRoutes");
app.use("/kpi", kpiStaffRoutes);

// Login routes 
app.get("/login", (req, res) => {
  res.redirect("/user-login");
});
app.get("/user-login", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "pages", "user-login.html"));
});
// userController handles login logic
app.post("/api/login", userController.loginUser);

// 404 catch-all route (for undefined routes)
app.use((req, res) => {
  res.status(404).send("Sorry, Page Not Found!");
});

// Global error handler for all server errors
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).send("Internal Server Error");
});

// Start the server on the configured port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
