document.getElementById("generateBtn").addEventListener("click", () => {
  const start = new Date(document.getElementById("startDate").value);
  const end = new Date(document.getElementById("endDate").value);
  const reportContainer = document.getElementById("reportResult");
  reportContainer.innerHTML = "";

  if (!start || !end || start > end) {
    reportContainer.innerHTML = "<p>Please enter a valid date range.</p>";
    return;
  }

  const currentUser = "Harry Potter"; // TODO: Replace with actual user
  const kpis = JSON.parse(localStorage.getItem("kpis")) || [];

  const filteredKPIs = kpis.filter(kpi => {
    return (
      new Date(kpi.dueDate) >= start &&
      new Date(kpi.dueDate) <= end
    );
  });

  if (filteredKPIs.length === 0) {
    reportContainer.innerHTML = "<p>No KPIs found for the selected date range.</p>";
    return;
  }

  filteredKPIs.forEach(kpi => {
    const kpiDiv = document.createElement("div");
    kpiDiv.classList.add("kpi-block");
    kpiDiv.innerHTML = `
      <h3>${kpi.title}</h3>
      <p><strong>Description:</strong> ${kpi.description}</p>
      <p><strong>Department:</strong> ${kpi.department}</p>
      <p><strong>Target:</strong> ${kpi.targetValue}</p>
      <p><strong>Due:</strong> ${kpi.dueDate}</p>
      <p><strong>Status:</strong> ${kpi.status}</p>
      <div>
        <strong>Evidence:</strong>
        <ul>
          ${kpi.evidence.map(e => `<li>${e.date}: ${e.description} (${e.status})</li>`).join("")}
        </ul>
      </div>
    `;
    reportContainer.appendChild(kpiDiv);
  });
});

document.getElementById("downloadPdfBtn").addEventListener("click", async () => {
  const report = document.getElementById("reportResult");
  if (!report.innerHTML.trim()) {
    alert("No report to download!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const canvas = await html2canvas(report, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pageWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let position = 10;
  if (imgHeight > pageHeight) {
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, pageHeight - 20);
  } else {
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  }

  pdf.save("kpi-report.pdf");
});

