// manager-assign-kpi.js
const form = document.getElementById("kpiForm");
// const kpiList = document.getElementById("kpis"); // This element is not in your HTML, consider removing or adding

// Base URL for your backend API
const API_BASE_URL = "http://localhost:3000"; // THIS MUST MATCH BACKEND PORT

// No longer needed to load from local storage
// window.addEventListener("DOMContentLoaded", () => {
//   const existingKpis = JSON.parse(localStorage.getItem("kpis")) || [];
//   existingKpis.forEach(renderKPI); // renderKPI is also not defined here, likely from manager-view-kpi.js
// });

form.addEventListener("submit", async (e) => { // Added 'async' keyword
  e.preventDefault();

  const kpiData = { // Renamed from 'kpi' to 'kpiData' for clarity
    title: document.getElementById("kpiTitle").value,
    description: document.getElementById("kpiDescription").value,
    staffName: document.getElementById("staffName").value, // Sent as name, backend resolves to ID
    targetValue: parseFloat(document.getElementById("targetValue").value),
    // department: document.getElementById("department").value, // Backend can get department from User model if needed
    dueDate: document.getElementById("dueDate").value,
    performanceIndicator: document.getElementById("performanceIndicator").value, // Maps to 'target' in backend
    // 'status' and 'progressNumber' are set by default in backend for new KPIs
    // 'evidence' will be handled later if needed
  };

  console.log("Submitting KPI Data:", kpiData);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/kpis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kpiData),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Get error message from backend
      throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
    }

    const newKpi = await response.json();
    console.log("KPI assigned successfully:", newKpi);

    alert("KPI assigned successfully!"); // Provide feedback to the user
    form.reset(); // Clear the form

    // Optional: Redirect to manager-view-assigned-kpi.html after successful assignment
    // window.location.href = "manager-view-assigned-kpi.html";

  } catch (error) {
    console.error("Error assigning KPI:", error);
    alert(`Failed to assign KPI: ${error.message}. Please check console for details.`);
  }
});

// If you have a renderKPI function from manager-view-kpi.js, it's not defined here.
// The assign page typically just submits and potentially redirects.
// If you want to list KPIs on this page, you'd need to copy/adapt renderKPI and fetchKpis functions.
// For now, I've removed the calls to renderKPI and localStorage.

