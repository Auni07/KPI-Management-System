function getUserRole() {
  return localStorage.getItem("userRole")?.toLowerCase() || null;
}
  
document.addEventListener("DOMContentLoaded", () => {
  const role = getUserRole();

  const staffDashboard = document.getElementById("staff-dashboard");
  const managerDashboard = document.getElementById("manager-dashboard");

  if (staffDashboard) staffDashboard.style.display = "none";
  if (managerDashboard) managerDashboard.style.display = "none";

  if (role === "staff") {
    staffDashboard.style.display = "block";
    loadStaffDashboard();
  } else if (role === "manager") {
    managerDashboard.style.display = "block";
    loadManagerDashboard();
  } else {
    alert("No role found. Please login again.");
    window.location.href = "index.html";
  }
});

// Load Manager Dashboard
async function loadManagerDashboard() {
  const token = localStorage.getItem("authToken");
  const headers = { 'Authorization': `Bearer ${token}` };

  try {
    const summaryRes = await fetch("http://localhost:3000/api/dashboard/summary", { headers });
    const summary = await summaryRes.json();

    document.getElementById("totalKpiCount").innerText = summary.data.total;
    document.getElementById("inProgressCount").innerText = summary.data.inProgress;
    document.getElementById("completedCount").innerText = summary.data.completed;
    document.getElementById("notStartedCount").innerText = summary.data.notStarted;
    document.getElementById("pendingApprovalCount").innerText = summary.data.pendingApproval;

    const avgScoreRes = await fetch("http://localhost:3000/api/dashboard/average-score-by-staff", { headers });
    const avgScore = await avgScoreRes.json();

    renderAvgScoreChart(avgScore.data);
    renderManagerPieChart(summary.data);

  } catch (err) {
    console.error("Manager dashboard fetch error:", err);
  }
}


// Load Staff Dashboard
async function loadStaffDashboard() {
  const token = localStorage.getItem("authToken");
  const headers = { 'Authorization': `Bearer ${token}` };

  try {
    // Earliest Due KPI
    const earliestRes = await fetch("http://localhost:3000/api/dashboard/my-earliest-kpi", { headers });
    const earliestKpi = await earliestRes.json();
    renderEarliestKpiCard(earliestKpi);

    // KPI Pie Chart
    const pieRes = await fetch("http://localhost:3000/api/dashboard/my-kpi-status-summary", { headers });
    const pieJson = await pieRes.json();
    renderPieChart(pieJson.data);

    // KPI Completion Bars
    const barRes = await fetch("http://localhost:3000/api/dashboard/my-kpi-progress-bars", { headers });
    const barJson = await barRes.json();
    renderProgressBarChart(barJson.data);

  } catch (err) {
    console.error("Staff dashboard fetch error:", err);
  }
}
// Render Staff earliest KPI Card
function renderEarliestKpiCard(kpi) {
  if (!kpi || !kpi._id) {
    document.getElementById("earliest-kpi-title").innerText = "🎉 No pending KPIs!";
    document.getElementById("earliest-kpi-date").innerText = "";
    document.getElementById("update-progress-btn").style.display = "none";
    return;
  }

  document.getElementById("earliest-kpi-title").innerText = kpi.title;
  document.getElementById("earliest-kpi-date").innerText = `Due: ${new Date(kpi.dueDate).toLocaleDateString()}`;
  document.getElementById("update-progress-btn").href = `/kpi/update/${kpi._id}`;

}

// Render Manager's Doughnut Chart: KPI Status Distribution
function renderManagerPieChart(data) {
  const ctx = document.getElementById('managerKpiStatusChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'In Progress', 'Not Started', 'Pending Approval'],
      datasets: [{
        data: [
          data.completed || 0,
          data.inProgress || 0,
          data.notStarted || 0,
          data.pendingApproval || 0
        ],
        backgroundColor: ['#28a745', '#ffc107', '#6c757d', '#17a2b8']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: {
          display: true,
          text: 'KPI Status Distribution'
        }
      }
    }
  });
}

// Render Manager's Bar Chart: Average KPI Completion by Staff
function renderAvgScoreChart(data) {
  const ctx = document.getElementById('managerKpiChart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(item => item.name),
      datasets: [{
        label: "Average Score",
        data: data.map(item => item.averageScore),
        backgroundColor: "#008080"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

// Render Staff's Doughnut Chart: KPI Status Distribution
function renderPieChart(data) {
  const ctx = document.getElementById('staffProgressChart').getContext('2d');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'In Progress', 'Not Started'],
      datasets: [{
        data: [data.completed, data.inProgress, data.notStarted],
        backgroundColor: ['#28a745', '#ffc107', '#dee2e6']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'KPI Status Distribution'
        }
      }
    }
  });
}

// Render Staff's Bar Chart: Each KPI's Completion Percentage
function renderProgressBarChart(data) {
  const ctx = document.getElementById('staffProgressBarChart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(item => item.title),
      datasets: [{
        label: 'Completion %',
        data: data.map(item => item.percent),
        backgroundColor: '#20c997'
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'x',
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'KPI Completion by Task'
        },
        legend: {
          display: false
        }
      }
    }
  });
}

