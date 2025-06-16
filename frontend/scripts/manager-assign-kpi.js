// manager-assign-kpi.js

// Base URL for your backend API
const API_BASE_URL = "http://localhost:3000";

const form = document.getElementById("kpiForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const kpiData = {
    title: document.getElementById("kpiTitle").value,
    description: document.getElementById("kpiDescription").value,
    staffName: document.getElementById("staffName").value,
    targetValue: parseFloat(document.getElementById("targetValue").value),
    dueDate: document.getElementById("dueDate").value,
    performanceIndicator: document.getElementById("performanceIndicator").value,
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
      const errorData = await response.json();
      throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
    }

    const newKpi = await response.json();
    console.log("KPI assigned successfully:", newKpi);

    alert("KPI assigned successfully!");
    form.reset();

    // Optional redirect:
    // window.location.href = "manager-view-assigned-kpi.html";

  } catch (error) {
    console.error("Error assigning KPI:", error);
    alert(`Failed to assign KPI: ${error.message}. Please check console for details.`);
  }
});
