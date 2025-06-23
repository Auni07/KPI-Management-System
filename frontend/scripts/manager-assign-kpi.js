// Base URL for your backend API
const API_BASE_URL = "http://localhost:3000";

// Wait for the DOM to load before running any script
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("kpiForm");
  const dueDateInput = document.getElementById("dueDate");

  // BONUS: Set minimum due date to today
  const todayStr = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  dueDateInput.setAttribute("min", todayStr);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Validate targetValue is a valid integer
    const targetValueInput = document.getElementById("targetValue").value;
    const regex = /^\d+$/;
    if (!regex.test(targetValueInput)) {
      alert("Target Value must be a valid integer (no decimals or alphabet characters).");
      return;
    }

    // Validate due date is not in the past
    const dueDateValue = dueDateInput.value;
    const dueDate = new Date(dueDateValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      alert("Due Date must be today or a future date. Please select a valid date.");
      return;
    }

    const kpiData = {
      title: document.getElementById("kpiTitle").value,
      description: document.getElementById("kpiDescription").value,
      staffName: document.getElementById("staffName").value,
      targetValue: parseInt(targetValueInput),
      dueDate: dueDateValue,
      performanceIndicator: document.getElementById("performanceIndicator").value,
    };

    // Ensure all required fields are filled
    if (
      !kpiData.title ||
      !kpiData.description ||
      !kpiData.staffName ||
      !kpiData.targetValue ||
      !kpiData.dueDate ||
      !kpiData.performanceIndicator
    ) {
      alert("Please fill in all required fields with valid data.");
      return;
    }

    console.log("Submitting KPI Data:", kpiData);

    try {
      const response = await fetch(`${API_BASE_URL}/api/kpis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      dueDateInput.setAttribute("min", todayStr); // Reset min date after form reset

      // Reload KPI cards in the other view (if the same page handles both)
     if (typeof fetchKpis === "function") {
    fetchKpis(); // Re-fetch KPI cards with current filters (optional: you can pass filters again)
    }

      // Optionally redirect:
      // window.location.href = "manager-view-assigned-kpi.html";

    } catch (error) {
      console.error("Error assigning KPI:", error);
      alert(`Failed to assign KPI: ${error.message}. Please check console for details.`);
    }
  });
});
