document.getElementById("generateBtn").addEventListener("click", async () => {
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  const reportContainer = document.getElementById("reportResult");
  reportContainer.innerHTML = "";

  if (!start || !end || new Date(start) > new Date(end)) {
    reportContainer.innerHTML = "<p>Please enter a valid date range.</p>";
    return;
  }

  // Fetch KPIs for the selected date range
  const res = await fetch(`/api/report?start=${start}&end=${end}`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authToken"),
    },
  });
  const data = await res.json();
  const kpis = data.kpis || [];

  if (kpis.length === 0) {
    reportContainer.innerHTML =
      "<p>No KPIs found for the selected date range.</p>";
    return;
  }

  kpis.forEach((kpi) => {
    const kpiDiv = document.createElement("div");
    kpiDiv.classList.add("kpi-block");
    kpiDiv.innerHTML = `
      <h3>${kpi.title}</h3>
      <p><strong>Description:</strong> ${kpi.description}</p>
      <p><strong>Target:</strong> ${kpi.targetValue}</p>
      <p><strong>Due:</strong> ${
        kpi.dueDate ? new Date(kpi.dueDate).toLocaleDateString() : ""
      }</p>
      <p><strong>Status:</strong> ${kpi.status}</p>
      <div>
        <strong>Evidence:</strong>
        <ul>
          ${(kpi.progressUpdates || [])
            .map(
              (e) =>
                `<li>${
                  e.createdAt ? new Date(e.createdAt).toLocaleDateString() : ""
                }: ${e.progressNote || ""}</li>`
            )
            .join("")}
        </ul>
      </div>
    `;
    reportContainer.appendChild(kpiDiv);
  });
});

document
  .getElementById("downloadPdfBtn")
  .addEventListener("click", async () => {
    const kpis = window.kpiReportData || [];
    if (!kpis.length) {
      alert("No report data found!");
      return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");
    let y = 15;

    pdf.setFontSize(18);
    pdf.text("KPI Report", 15, y);
    y += 10;

    kpis.forEach((kpi, idx) => {
      pdf.setFontSize(14);
      pdf.text(`${idx + 1}. ${kpi.title}`, 15, y);
      y += 8;

      pdf.setFontSize(11);
      pdf.text(`Description: ${kpi.description || ""}`, 15, y);
      y += 6;
      pdf.text(`Target: ${kpi.targetValue || ""}`, 15, y);
      y += 6;
      pdf.text(
        `Due: ${kpi.dueDate ? new Date(kpi.dueDate).toLocaleDateString() : ""}`,
        15,
        y
      );
      y += 6;
      pdf.text(`Status: ${kpi.status || ""}`, 15, y);
      y += 6;

      // Evidence
      if (kpi.progressUpdates && kpi.progressUpdates.length) {
        pdf.text("Evidence:", 15, y);
        y += 6;
        kpi.progressUpdates.forEach((e) => {
          const line = `- ${
            e.createdAt ? new Date(e.createdAt).toLocaleDateString() : ""
          }: ${e.progressNote || ""}`;
          pdf.text(line, 20, y);
          y += 6;
        });
      }
      y += 4;
      // Change page if needed
      if (y > 270) {
        pdf.addPage();
        y = 15;
      }
    });
  });
