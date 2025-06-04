// Always retrieve fresh KPIs from localStorage
function getStoredKpis() {
  return JSON.parse(localStorage.getItem("kpis")) || [];
}

// DOM elements
const kpiCardsContainer = document.getElementById("kpiCardsContainer");
const filterStaff = document.getElementById("filterStaff");
const filterDepartment = document.getElementById("filterDepartment");
const filterStatus = document.getElementById("filterStatus");

// Render KPI cards
function renderCards(kpis) {
  kpiCardsContainer.innerHTML = "";

  if (kpis.length === 0) {
    kpiCardsContainer.innerHTML = `
      <div class="col-12 text-center mt-4">
        <p class="text-muted">No KPIs match the selected filters.</p>
      </div>
    `;
    return;
  }

  kpis.forEach((kpi) => {
    const card = document.createElement("div");
    card.className = "col-md-6 col-lg-4 mb-4";

    // Determine the progress percentage based on the progressStatus
    let progressPercentage = 0;
    let progressText = "";
    switch (kpi.progressStatus?.toLowerCase()) {
      case "completed":
        progressPercentage = 100;
        progressText = "Completed";
        break;
      case "in progress":
        progressPercentage = 50;
        progressText = "In Progress";
        break;
      case "not started":
        progressPercentage = 0;
        progressText = "Not Started";
        break;
    }

    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 class="card-title">
              <a href="manager-kpi-detail.html?id=${kpi.id}" class="text-decoration-none text-primary">
                ${kpi.title}
              </a>
            </h5>
            <p class="card-text"><strong>Description:</strong> ${kpi.description}</p>
            <p class="card-text"><strong>Staff:</strong> ${kpi.staffName}</p>
            <p class="card-text"><strong>Department:</strong> ${kpi.department}</p>
            <p class="card-text"><strong>Target:</strong> ${kpi.targetValue}</p>
            <p class="card-text"><strong>Current:</strong> ${kpi.currentValue}</p>
            <p class="card-text"><strong>Due Date:</strong> ${kpi.dueDate}</p>
            <p class="card-text"><strong>Indicators:</strong> ${kpi.performanceIndicator}</p>
            <p class="card-text"><strong>Progress:</strong> ${progressText}</p>
            <div class="progress" style="height: 20px;">
              <div class="progress-bar" role="progressbar" aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100" style="width: ${progressPercentage}%;"></div>
            </div>
          </div>
          <div class="mt-3 d-flex justify-content-between align-items-center">
            ${kpi.status?.toLowerCase() === "pending"
              ? `<a href="manager-view-evidence.html?id=${kpi.id}" class="btn btn-sm btn-outline-primary">Review</a>`
              : `<span></span>`
            }
            <span class="badge bg-${getStatusColor(kpi.status)}">${kpi.status}</span>
          </div>
        </div>
      </div>
    `;

    kpiCardsContainer.appendChild(card);
  });
}

// Determine status color
function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    case "pending":
      return "warning text-dark";
    default:
      return "secondary";
  }
}

// Filter logic
function applyFilters() {
  const staff = filterStaff.value.toLowerCase();
  const department = filterDepartment.value.toLowerCase();
  const status = filterStatus.value.toLowerCase();

  const kpis = getStoredKpis();

  const filtered = kpis.filter((kpi) =>
    (staff === "" || kpi.staffName.toLowerCase().includes(staff)) &&
    (department === "" || kpi.department.toLowerCase().includes(department)) &&
    (status === "" || kpi.status.toLowerCase().includes(status))
  );

  renderCards(filtered);
}

// Add event listeners
[filterStaff, filterDepartment, filterStatus].forEach((input) => {
  input.addEventListener("input", applyFilters);
});

// Initial render using localStorage
renderCards(getStoredKpis());

//RESET PURPOSE!! PLS DELETE ONCE BACKEND IS ESTABLISHED!!!
document.getElementById("BTN-RESET").addEventListener("click", function () {
    localStorage.setItem("kpis", JSON.stringify(sampleKPIs));
    window.location.reload();  // Reload the page to re-render with new data
});