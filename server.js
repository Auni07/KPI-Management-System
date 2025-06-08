require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Models
const User = require("./models/user");
const KPI = require("./models/kpi");

app.use(cors());
app.use(express.json({ extended: false }));

// Connect DB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/kpi_system", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Session
app.use(
  session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Routes
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/kpis', require('./routes/kpiRoutes'));
app.use('/api', require('./routes/userRoutes'));

// Simple root route
app.get('/', (req, res) => res.send('API Running'));

// Load staff KPI routes
const kpiStaffRoutes = require("./routes/kpiStaffRoutes");
app.use("/kpi", kpiStaffRoutes);

// Web Page Routes (Login, Dashboard)
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password.");
    }

    req.session.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    res.redirect("/api/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error during login.");
  }
});

// 404 catch-all route
app.use((req, res) => {
  res.status(404).send("Sorry, Page Not Found!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).send("Internal Server Error");
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});