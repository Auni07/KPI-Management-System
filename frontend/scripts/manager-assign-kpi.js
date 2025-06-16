// Base URL for your backend API
const API_BASE_URL = "http://localhost:3000";

console.log('Hello from the console!');

const form = document.getElementById("kpiForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();  // Prevent default form submission
  e.stopPropagation(); // Stop the event from propagating and triggering multiple times

  // Get the targetValue input value
  const targetValueInput = document.getElementById("targetValue").value;

  // Check if targetValueInput is a valid integer (no decimals or alphabets)
  // Use a regex to check if the value consists only of digits (integer only)
  const regex = /^\d+$/;  // Only digits, no decimals or letters

  // If it doesn't match the regex (it's not a valid integer)
  if (!regex.test(targetValueInput)) {
    alert("Target Value must be a valid integer (no decimals or alphabet characters).");
    return; // Prevent form submission if it's not a valid integer
  }

  const targetValue = parseInt(targetValueInput); // Convert to an integer

  const kpiData = {
    title: document.getElementById("kpiTitle").value,
    description: document.getElementById("kpiDescription").value,
    staffName: document.getElementById("staffName").value,
    targetValue: targetValue, // Ensure it's an integer
    dueDate: document.getElementById("dueDate").value,
    performanceIndicator: document.getElementById("performanceIndicator").value,
  };

  // Ensure all the fields are filled before submitting
  if (!kpiData.title || !kpiData.description || !kpiData.staffName || !kpiData.targetValue) {
    alert("Please fill in all required fields with valid data.");
    return; // Stop the submission if data is incomplete
  }

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
