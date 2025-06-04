const kpiId = new URLSearchParams(window.location.search).get("id");
const kpis = JSON.parse(localStorage.getItem("kpis") || "[]");
const kpi = kpis.find(k => k.id === kpiId);


document.querySelector(".card-title").textContent = kpi.title;
document.getElementById("kpi-target").textContent = kpi.targetValue;
document.getElementById("kpi-current").textContent = kpi.currentValue;
document.getElementById("kpi-staff").textContent = kpi.staffName;
document.getElementById("kpi-status").textContent = kpi.status;
document.getElementById("kpi-dueDate").textContent = kpi.dueDate;

const timeline = document.querySelector(".timeline");
timeline.innerHTML = "";

kpi.evidence.forEach(evi => {
  timeline.innerHTML += `
    <li>
      <div class="timeline-badge"><i  class="fas fa-upload"></i></div>
      <div class="timeline-panel">
        <div class="timeline-heading"><h6 class="timeline-title">${evi.date}</h6></div>
        <div class="timeline-body">
          <p><strong>Progress:</strong> ${evi.description}</p>
          <p>
            <a href="${evi.status === "Pending" ? `manager-view-evidence.html?id=${kpi.id}` : "#"}">📄 ${evi.file}</a>
            - <span class="badge bg-${evi.status === "Approved" ? "success" : evi.status === "Rejected" ? "danger" : "warning text-white"}">${evi.status}</span>
          </p>
        </div>
      </div>
    </li>
  `;
});
