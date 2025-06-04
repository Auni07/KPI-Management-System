// Ensure the document is loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", function() {
  const kpiId = new URLSearchParams(window.location.search).get("id");
  let kpis = JSON.parse(localStorage.getItem("kpis")) || [];
  const kpi = kpis.find(k => k.id === kpiId);

  if (!kpi) {
    alert("KPI not found");
    return;
  }

  // Update the DOM with the current KPI data
  document.getElementById("kpi-title").textContent = kpi.title;
  document.getElementById("kpi-description").textContent = kpi.description;
  document.getElementById("kpi-staff").textContent = kpi.staffName;
  document.getElementById("kpi-status").textContent = kpi.status;
  document.getElementById("kpi-evidence").textContent = kpi.evidence[0]?.file || "No evidence file";;
  document.getElementById("gva-actual").textContent = `${kpi.currentValue}`;
  document.getElementById("gva-target").textContent = `/${kpi.targetValue}`;

  // Open the evidence file
  const downloadLink = document.getElementById("kpi-evidence");

  if (!kpi.evidence || kpi.evidence.length === 0) {
    downloadLink.textContent = "No Evidence Available";
    downloadLink.removeAttribute("href");
    downloadLink.removeAttribute("download");
    return;
  }

  // Generate PDF using jsPDF
downloadLink.addEventListener("click", function (e) {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  kpi.evidence.forEach((ev, i) => {
    doc.text(`Date: ${ev.date}`, 10, 20 + i * 40);
    doc.text(`Description: ${ev.description}`, 10, 30 + i * 40);
    doc.text(`File: ${ev.file}`, 10, 40 + i * 40);
    doc.text(`Status: ${ev.status}`, 10, 50 + i * 40);

    // Add a new page if more than 2 evidence entries
    if ((i + 1) % 2 === 0 && i < kpi.evidence.length - 1) {
      doc.addPage();
    }
  });

  doc.save(`${kpi.title.replace(/\s+/g, "_")}_evidence.pdf`);
});


// EDIT/DONE button functionality
document.getElementById("Btn-GvA-Edit").addEventListener("click", function() {
  const gvAValue = document.getElementById("gva-actual").innerText;
  const splitValue = gvAValue.split("/");

  if (this.innerText === "Edit") {
    const input = document.createElement("input");
    input.type = "number";
    input.value = splitValue[0];  // Current progress value
    document.getElementById("gva-actual").innerHTML = '';  // Clear the current value
    document.getElementById("gva-actual").appendChild(input);  // Append the input
    this.innerText = "Done";  // Change button to DONE
  } else {
    const newValue = document.querySelector("#gva-actual input").value;  // Get the input value
    document.getElementById("gva-actual").innerHTML = `${newValue}`;  // Update the DOM
    kpi.currentValue = parseFloat(newValue);  // Update the kpi's progress with the new value
    const progressPercentage = kpi.currentValue / kpi.targetValue;
    if (progressPercentage == 1)
      kpi.progressStatus = "Completed"
    else if (progressPercentage < 1 && progressPercentage > 0)
      kpi.progressStatus = "In Progress"
    this.innerText = "Edit";  // Change button back to EDIT
  }
});

// Approve button functionality
document.getElementById("Btn-Approve").addEventListener("click", function () {
  kpi.status = "Approved";  // Change the KPI's status to "Approved"
  
  // Find the index of the KPI in the kpis array
  const index = kpis.findIndex(k => k.id === kpiId);
  if (index !== -1) {
    kpis[index] = kpi;  // Update the KPI in the kpis array
    localStorage.setItem("kpis", JSON.stringify(kpis));  // Save the updated kpis array back to localStorage
  }

  // Redirect to another page
  window.location.href = "manager-view-assigned-kpi.html";
});

// Reject button functionality
document.getElementById("Btn-Reject").addEventListener("click", function () {
  kpi.status = "Rejected";  // Change the KPI's status to "Rejected"

  // Find the index of the KPI in the kpis array
  const index = kpis.findIndex(k => k.id === kpiId);
  if (index !== -1) {
    kpis[index] = kpi;  // Update the KPI in the kpis array
    localStorage.setItem("kpis", JSON.stringify(kpis));  // Save the updated kpis array back to localStorage
  }

  // Redirect to another page
  window.location.href = "manager-view-assigned-kpi.html";
  });
});

