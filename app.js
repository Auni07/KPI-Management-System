const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const port = 3000;

const User = require("./models/User"); // User mongoose model
const KPI = require("./models/kpi"); // KPI mongoose model

// Serve static files from 'public' or 'styles' folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse URL-encoded bodies and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Session setup
app.use(
  session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Connect DB
mongoose.connect("mongodb://localhost:27017/kpi_system");

// Login form route
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  console.log("Found user:", user);

  if (user) {
    req.session.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    res.redirect("/dashboard");
  } else {
    res.send("Login failed");
  }
});

app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const user = req.session.user; // grab the whole user session
  console.log("User session:", user);

  if (user.role === "manager") {
    res.render("dashboard-manager", { user });
  } else if (user.role === "staff") {
    res.render("dashboard-staff", { user });
  } else {
    res.send("Unauthorized");
  }
});

// kpi routes
const kpiStaffRoutes = require("./routes/kpi-staff");
app.use("/kpi", kpiStaffRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//manager routes

// GET route to handle invalid request or route path using an asterisk (*)  wildcard
// Placing this route as the last route
app.get(/(.*)/, (req, res) => {
  res.status(404).send("Sorry, Page Not Found!");
});

// This app starts a server and listens on port 3000 for connections.
app.listen(port, () => {
  console.log(`Server has started and App is listening on port ${port}`);
});
