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
      'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    }
  });
  const data = await res.json();
  const kpis = data.kpis || [];

  if (kpis.length === 0) {
    reportContainer.innerHTML = "<p>No KPIs found for the selected date range.</p>";
    return;
  }

  kpis.forEach(kpi => {
    const kpiDiv = document.createElement("div");
    kpiDiv.classList.add("kpi-block");
    kpiDiv.innerHTML = `
      <h3>${kpi.title}</h3>
      <p><strong>Description:</strong> ${kpi.description}</p>
      <p><strong>Department:</strong> ${kpi.department || ''}</p>
      <p><strong>Target:</strong> ${kpi.targetValue}</p>
      <p><strong>Due:</strong> ${kpi.dueDate ? new Date(kpi.dueDate).toLocaleDateString() : ''}</p>
      <p><strong>Status:</strong> ${kpi.status}</p>
      <div>
        <strong>Evidence:</strong>
        <ul>
          ${(kpi.progressUpdates || []).map(e => `<li>${e.createdAt ? new Date(e.createdAt).toLocaleDateString() : ''}: ${e.progressNote || ''}</li>`).join("")}
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
  const marginX = 10; // 左右页边距
  const marginY = 15; // 上下页边距
  const imgWidth = pageWidth - marginX * 2;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let position = marginY;
  if (imgHeight > pageHeight - marginY * 2) {
    pdf.addImage(imgData, "PNG", marginX, position, imgWidth, pageHeight - marginY * 2);
  } else {
    pdf.addImage(imgData, "PNG", marginX, position, imgWidth, imgHeight);
  }
  pdf.save("kpi-report.pdf");
});

