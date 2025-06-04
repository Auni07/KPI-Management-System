import { getUserRole } from './auth.js';

document.addEventListener("DOMContentLoaded", () => {
  const role = getUserRole();

  const staffDashboard = document.getElementById("staff-dashboard");
  const managerDashboard = document.getElementById("manager-dashboard");

  if (staffDashboard) staffDashboard.style.display = "none";
  if (managerDashboard) managerDashboard.style.display = "none";

  if (role === "staff") {
    staffDashboard.style.display = "block";
  } else if (role === "manager") {
    managerDashboard.style.display = "block";
  } else {
    alert("No role found. Please login again.");
    window.location.href = "index.html";
  }
});

