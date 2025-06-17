// DOM elements
const kpiCardsContainer = document.getElementById("kpiCardsContainer");
const filterStaff = document.getElementById("filterStaff");
const filterDepartment = document.getElementById("filterDepartment");
const filterStatus = document.getElementById("filterStatus");

// Base URL for your backend API
const API_BASE_URL = "http://localhost:3000"; // THIS MUST MATCH BACKEND PORT

// Function to fetch KPIs from the backend
async function fetchKpis(filters = {}) {
  let url = `${API_BASE_URL}/api/kpis`;
  const params = new URLSearchParams();

  if (filters.staffId) params.append("staffId", filters.staffId);
  if (filters.department) params.append("department", filters.department);
  if (filters.status) params.append("status", filters.status);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const kpis = await response.json();
    renderCards(kpis);
  } catch (error) {
    console.error("Error fetching KPIs:", error);
    kpiCardsContainer.innerHTML = `
      <div class="col-12 text-center mt-4">
        <p class="text-danger">Failed to load KPIs. Please check the connection to the backend.</p>
      </div>
    `;
  }
}

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

    let progressText = "";
    let progressPercentage = 0;
    
    // This logic correctly determines progress based on numbers
    if (kpi.progressNumber >= kpi.targetValue && kpi.targetValue !== 0
      && kpi.approvalstat?.toLowerCase() === "approved")
       {
        progressText = "Completed";
        progressPercentage = 100;
    } else if (kpi.progressNumber > 0 && kpi.progressNumber < kpi.targetValue) {
        progressText = "In Progress";
        progressPercentage = (kpi.progressNumber / kpi.targetValue) * 100;
    } else if (kpi.progressNumber === 0) {
        progressText = "Not Started";
        progressPercentage = 0;
    } else {
        progressText = "Check Values"; 
      progressPercentage = 100;
    }

    // Sanitize and cap progress value
    if (isNaN(progressPercentage) || !isFinite(progressPercentage)) {
        progressPercentage = 0;
    }
    
    progressPercentage = Math.min(100, Math.round(progressPercentage));//capped at 100

    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 class="card-title">
              <a href="manager-kpi-detail.html?id=${kpi._id}" class="text-decoration-none text-primary">
                ${kpi.title}
              </a>
            </h5>
            <p class="card-text"><strong>Description:</strong> ${kpi.description}</p>
            <p class="card-text"><strong>Staff:</strong> ${kpi.assignedTo?.name || 'Unassigned'}</p>
            <p class="card-text"><strong>Department:</strong> ${kpi.assignedTo?.department || 'N/A'}</p>
            <p class="card-text"><strong>Target:</strong> ${kpi.targetValue}</p>
            <p class="card-text"><strong>Current Progress:</strong> ${kpi.progressNumber}</p>
            <p class="card-text"><strong>Due Date:</strong> ${new Date(kpi.dueDate).toLocaleDateString()}</p>
            <p class="card-text"><strong>Indicators:</strong> ${kpi.target}</p>
            <p class="card-text"><strong>Progress:</strong> ${progressText}</p>
            <div class="progress" style="height: 20px;">
            <div class="progress-bar" role="progressbar" 
                aria-valuenow="${progressPercentage}" 
                aria-valuemin="0" 
                aria-valuemax="100" 
                style="width: ${progressPercentage}%;">
                ${progressPercentage}%
              </div>
            </div>

          </div>
          <div class="mt-3 d-flex align-items-center">
            ${
              kpi.approvalstat === "Pending"
              ? `<a href="http://localhost:3000/pages/manager-view-evidence.html?id=${kpi._id}" class="btn btn-sm btn-outline-primary me-auto">Review</a>`
              : `<span class="me-auto"></span>`
            }
            <span class="badge bg-${getStatusColor(kpi.approvalstat)}">${kpi.approvalstat}</span>
          </div>
        </div>
      </div>
    `;
    kpiCardsContainer.appendChild(card);
  });
}

// Determine status color
function getStatusColor(approvalstat) {
  switch (approvalstat?.toLowerCase()) {
    case "approved":
      return "success";
     case "rejected":
      return "danger";
    case "no new progress":
    case "pending":
      return "warning text-dark";
    default:
      return "secondary";
  }
}

// Filter logic
function applyFilters() {
  const staffId = filterStaff.value;
  const department = filterDepartment.value;
  const status = filterStatus.value;

  // *** CHANGE: Pass the staff ID with the correct parameter name ***
  fetchKpis({
    staffId: staffId,
    department: department,
    status: status
  });
}

// Function to populate a dropdown
function populateDropdown(selectElement, items, idField, nameField) {
  selectElement.innerHTML = '<option value="">All</option>';
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = idField ? item[idField] : item;
    option.textContent = nameField ? item[nameField] : item;
    selectElement.appendChild(option);
  });
}

// Fetch and populate departments
async function fetchAndPopulateDepartments() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/departments`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const departments = await response.json();
    // Assuming backend returns an array of strings: ["HR", "Engineering", "Sales"]
    populateDropdown(filterDepartment, departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
  }
}

// Fetch and populate staff
async function fetchAndPopulateStaff() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/staff`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const staff = await response.json();
    // Assuming backend returns an array of objects: [{ _id: '...', name: '...' }]
    populateDropdown(filterStaff, staff, '_id', 'name');
  } catch (error) {
    console.error("Error fetching staff:", error);
  }
}

// Event listeners for filter dropdowns
[filterStaff, filterDepartment, filterStatus].forEach((input) => {
  input.addEventListener("change", applyFilters);
});

// On DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchKpis(); // Load all KPIs
  fetchAndPopulateDepartments(); // Populate department filter
  fetchAndPopulateStaff(); // Populate staff filter
});