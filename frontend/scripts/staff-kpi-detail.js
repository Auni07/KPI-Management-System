const params = new URLSearchParams(window.location.search); 
const kpiId = params.get('id');

const selectedKpi = kpiData.find(kpi => kpi.id === kpiId);

if (selectedKpi) {
  document.getElementById('kpiTitle').textContent = selectedKpi.title;
  document.getElementById('kpiDescription').textContent = selectedKpi.description;
  document.getElementById('kpiTarget').textContent = selectedKpi.target;
  document.getElementById('kpiProgress').textContent = selectedKpi.progress;
  document.getElementById('kpiCompletion').textContent = selectedKpi.completion;
  document.getElementById('kpiStartDate').textContent = selectedKpi.startDate;
  document.getElementById('kpiDueDate').textContent = selectedKpi.dueDate;
  document.getElementById('kpiStatus').textContent = selectedKpi.status;

  // If the KPI is completed, hide the update form and show a congratulatory message
  if (selectedKpi.status === "Completed") {
    document.getElementById('updateFormCard').style.display = "none";

    const congratsMessage = document.createElement("div");
    congratsMessage.classList.add("alert", "alert-success", "mt-3");
    congratsMessage.textContent = "Congratulations! You've successfully completed this KPI.";
    document.querySelector(".card-body").appendChild(congratsMessage);
  }
} else {
  alert("KPI not found");
}

// Send the updated progress to the staff view KPI page
document.querySelector('form').addEventListener('submit', function (event) {
  event.preventDefault();
  localStorage.setItem('progressUpdated', 'true');
  window.location.href = 'staff-view-kpi.html';
});
