const form = document.getElementById("kpiForm");
const kpiList = document.getElementById("kpis");

// Load and render existing KPIs on page load
window.addEventListener("DOMContentLoaded", () => {
  const existingKpis = JSON.parse(localStorage.getItem("kpis")) || [];
  existingKpis.forEach(renderKPI);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const kpi = {
    id: `kpi-${Date.now()}`, // Unique ID
    title: document.getElementById("kpiTitle").value,
    description: document.getElementById("kpiDescription").value,
    staffName: document.getElementById("staffName").value,
    targetValue: parseFloat(document.getElementById("targetValue").value), // Ensure it's a number
    department: document.getElementById("department").value,
    dueDate: document.getElementById("dueDate").value,
    performanceIndicator: document.getElementById("performanceIndicator").value,
    status: "Pending", // Default status
    progress: 0,        // Optional: track progress from 0
    evidence: []        // Empty array to hold file uploads or comments later
  };

  const kpis = JSON.parse(localStorage.getItem("kpis")) || [];
  kpis.push(kpi);
  localStorage.setItem("kpis", JSON.stringify(kpis));

  renderKPI(kpi); // Show it on the page
  form.reset();
});

