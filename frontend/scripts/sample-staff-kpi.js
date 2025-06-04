const params = new URLSearchParams(window.location.search);
const kpiId = params.get('id');

const kpiData = [
  {
    id: "1",
    title: "Increase Website Traffic",
    description: "Improve website visits by 30% in Q2.",
    target: "30% increase",
    progress: "10%",
    completion: "33.33%",
    startDate: "2025-04-01",
    dueDate: "2025-06-30",
    status: "In Progress",
    approvalstat: "Pending Approval"
  },
  {
    id: "2",
    title: "Customer Satisfaction Score",
    description: "Achieve an 85% satisfaction rating.",
    target: "85%",
    progress: "60%",
    completion: "70.59%",
    startDate: "2025-01-01",
    dueDate: "2025-05-31",
    status: "In Progress",
    approvalstat: "No New Progress"
  },
  {
    id: "3",
    title: "Weekly Content Delivery",
    description: "Post a total 12 posts on social media",
    target: "12 posts",
    progress: "5 posts",
    completion: "41.67%",
    startDate: "2025-01-30",
    dueDate: "2025-06-30",
    status: "In Progress",
    approvalstat: "Pending Approval"
  },
  {
    id: "4",
    title: "Customer Feedback Survey",
    description: "Collect 300 feedback surveys from customers",
    target: "300 surveys",
    progress: "0 surveys",
    completion: "0%",
    startDate: "2025-04-06",
    dueDate: "2025-08-31",
    status: "Not Started",
    approvalstat: "Rejected"
  },
  {
    id: "5",
    title: "Vendor Connections",
    description: "Post a total 12 posts on social media",
    target: "10 Connections",
    progress: "10 Connections",
    completion: "100%",
    startDate: "2025-01-02",
    dueDate: "2025-04-26",
    status: "Completed",
    approvalstat: "Approved"
  },
  {
    id: "6",
    title: "Monthly Newsletter Subscribers",
    description: "Gain 500 new subscribers by end of Q2",
    target: "500 subscribers",
    progress: "320 subscribers",
    completion: "64%",
    startDate: "2025-03-01",
    dueDate: "2025-06-30",
    status: "In Progress",
    approvalstat: "Pending Approval"
  },
  {
    id: "7",
    title: "Product Feature Rollout",
    description: "Deploy new product feature to 100% of users",
    target: "100% deployment",
    progress: "70%",
    completion: "70%",
    startDate: "2025-01-15",
    dueDate: "2025-04-15",
    status: "In Progress",
    approvalstat: "Approved"
  },
  {
    id: "8",
    title: "Team Training Program",
    description: "Complete 4 training sessions for staff",
    target: "4 sessions",
    progress: "0 sessions",
    completion: "0%",
    startDate: "2025-05-01",
    dueDate: "2025-07-31",
    status: "Not Started",
    approvalstat: "No New Progress"
  }
];

    document.addEventListener("DOMContentLoaded", function () {
  const kpiCardsContainer = document.getElementById("kpiCardsContainerStaff");

  kpis.forEach(kpi => {
    const card = document.createElement("div");
    card.className = "col";

    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${kpi.title}</h5>
          <p class="card-text">Status: ${kpi.status}</p>
        </div>
      </div>
    `;

    kpiCardsContainer.appendChild(card);
  });
});

const container = document.getElementById('kpiCardsContainerStaff');

kpiData.forEach(kpi => {
  const card = document.createElement('div');
  card.className = 'col';
  card.innerHTML = `
    <div class="card h-100">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title mb-3">
          <a href="staff-kpi-detail.html?id=${kpi.id}" class="text-decoration-none card-title">
            ${kpi.title}
          </a>
        </h5>
        <p class="mb-3"><strong>Target:</strong> ${kpi.target}</p>
        <p class="mb-3"><strong>Progress:</strong> ${kpi.progress}</p>
        <p class="mb-3"><strong>Status:</strong> ${kpi.status}</p>

        <div class="mb-3">
          <strong>Approval Status:</strong>
          <span class="badge ${getApprovalBadgeClass(kpi.approvalstat) }">${kpi.approvalstat}</span>
        </div>

        <div class="mb-4">
          <p class="mb-3"><strong>Percentage Completion:</strong> ${kpi.completion}</p>
          <div class="progress" style="height: 20px">
            <div
              class="progress-bar btn-success"
              role="progressbar"
              style="width: ${kpi.completion}"
              aria-valuenow="${parseFloat(kpi.completion)}"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              ${kpi.completion}
            </div>
          </div>
        </div>

        <div class="mt-auto text-end">
          <a href="staff-kpi-detail.html?id=${kpi.id}" class="btn btn-warning btn-sm">Update Progress</a>
        </div>
      </div>
    </div>
  `;
  container.appendChild(card);
});

function getApprovalBadgeClass(status) {
  switch (status) {
    case "Pending Approval":
      return "bg-warning text-dark";
    case "Approved":
      return "bg-success text-light";
    case "No New Progress":
      return "bg-secondary text-light";
    case "Rejected":
        return "bg-danger text-light";
    default:
      return "bg-secondary text-light";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const totalKPI = kpiData.length;
  const completed = kpiData.filter(kpi => kpi.status === "Completed").length;
  const inProgress = kpiData.filter(kpi => kpi.status === "In Progress").length;
  const notStarted = kpiData.filter(kpi => kpi.status === "Not Started").length;
  const pendingApproval = kpiData.filter(kpi => kpi.approvalstat === "Pending Approval").length;

  // Update card values
  document.getElementById("totalKpiCount").textContent = totalKPI;
  document.getElementById("inProgressCount").textContent = inProgress;
  document.getElementById("completedCount").textContent = completed;
  document.getElementById("notStartedCount").textContent = notStarted;
  document.getElementById("pendingApprovalCount").textContent = pendingApproval;
});

  const kpiCardsContainerStaff = document.getElementById('kpiCardsContainerStaff');
  const statusFilter = document.getElementById('statusFilter');

  function renderKPICards(filterStatus) {
  kpiCardsContainerStaff.innerHTML = '';

  const filteredData = filterStatus === 'All'
    ? kpiData
    : kpiData.filter(kpi => kpi.status === filterStatus);

  filteredData.forEach(kpi => {
    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-3">
            <a href="staff-kpi-detail.html?id=${kpi.id}" class="text-decoration-none card-title">
              ${kpi.title}
            </a>
          </h5>
          <p class="mb-3"><strong>Target:</strong> ${kpi.target}</p>
          <p class="mb-3"><strong>Progress:</strong> ${kpi.progress}</p>
          <p class="mb-3"><strong>Status:</strong> ${kpi.status}</p>

          <div class="mb-3">
            <strong>Approval Status:</strong>
            <span class="small-badge ${getApprovalBadgeClass(kpi.approvalstat)}">${kpi.approvalstat}</span>
          </div>

          <div class="mb-4">
            <p class="mb-3"><strong>Percentage Completion:</strong> ${kpi.completion}</p>
            <div class="progress" style="height: 20px">
              <div
                class="progress-bar btn-success"
                role="progressbar"
                style="width: ${kpi.completion}"
                aria-valuenow="${parseFloat(kpi.completion)}"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                ${kpi.completion}
              </div>
            </div>
          </div>

          <div class="mt-auto text-end">
            <a href="staff-kpi-detail.html?id=${kpi.id}" class="btn btn-warning btn-sm">Update Progress</a>
          </div>
        </div>
      </div>
    `;
    kpiCardsContainerStaff.appendChild(card);
  });

  if (filteredData.length === 0) {
    kpiCardsContainerStaff.innerHTML = '<p class="text-center">No KPI found for this status.</p>';
  }
}

  // Initial render (show all)
  renderKPICards('All');

  // Filter on change
  statusFilter.addEventListener('change', () => {
    renderKPICards(statusFilter.value);
  });