document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const kpiId = urlParams.get('id');
  let kpi;  // make kpi accessible in multiple places

  try {
    const response = await fetch('http://localhost:3000/api/kpis/' + kpiId);
    if (!response.ok) throw new Error('Failed to fetch KPI');

    kpi = await response.json();

    document.getElementById('kpi-title').textContent = kpi.title;
    document.getElementById('kpi-description').textContent = kpi.description;
    document.getElementById('kpi-status').textContent = kpi.status;
    document.getElementById('gva-target').textContent = kpi.targetValue;
    document.getElementById('gva-actual').textContent = kpi.progressNumber;
    document.getElementById('kpi-staff').textContent = kpi.assignedTo ? kpi.assignedTo.name : 'Unassigned';

    // Check if kpi.file exists and has filePath
    if (kpi.progressUpdates.length > 0 && kpi.progressUpdates[0].file?.filePath) {
      const evidenceLink = document.getElementById("kpi-evidence");
      const safePath = kpi.progressUpdates[0].file.filePath.replace(/\\/g, "/");
      evidenceLink.href = `http://localhost:3000/${safePath}`;
      evidenceLink.textContent = "View Evidence File";
      evidenceLink.target = "_blank";
    } else {
      document.getElementById("kpi-evidence").textContent = "No file submitted.";
    }
    console.log("KPI data:", kpi);
  } catch (error) {
    console.error(error);
    document.getElementById('kpi-output').textContent = 'Error loading KPI data';
  }

  // Attach Edit button listener here, NOT inside downloadLink listener
  document.getElementById("Btn-GvA-Edit").addEventListener("click", async function() {
    const actualSpan = document.getElementById("gva-actual");
    const targetSpan = document.getElementById("gva-target");
    const targetValue = parseFloat(targetSpan.textContent);
    
    if (this.innerText === "Edit") {
      const currentValue = actualSpan.textContent.trim();
      const input = document.createElement("input");
      input.type = "number";
      input.min = 0;
      input.max = targetValue;
      input.value = currentValue || 0;
      actualSpan.innerHTML = '';
      actualSpan.appendChild(input);
      this.innerText = "Done";
    } else {
      const input = actualSpan.querySelector("input");
      if (!input) return;

      const newValue = parseFloat(input.value);
      if (isNaN(newValue) || newValue < 0 || newValue > targetValue) {
        alert(`Please enter a number between 0 and ${targetValue}`);
        return;
      }

      actualSpan.textContent = newValue;
      this.innerText = "Edit";

      const progressPercentage = newValue / targetValue;
      let status = "Not Started";
      if (progressPercentage === 1) {
        status = "Completed";
      } else if (progressPercentage > 0) {
        status = "In Progress";
      }

      kpi.progressNumber = newValue;
      kpi.status = status;

      try {
        const response = await fetch(`http://localhost:3000/api/kpis/${kpi._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            progressNumber: kpi.progressNumber,
            status: kpi.status,
          }),
        });

        if (!response.ok) {
          let errorMsg = 'Update failed';
          try {
            const errorData = await response.json();
            console.error("Error response from server:", errorData);
            alert("Could not save changes. Server error:\n" + (errorData.message || JSON.stringify(errorData)));
            if (errorData.errors && typeof errorData.errors === 'object') {
              errorMsg = Object.values(errorData.errors).map(e => e.message).join('\n');
            } else if (errorData.msg) {
              errorMsg = errorData.msg;
            } else if (errorData.message) {
              errorMsg = errorData.message;
            }
          } catch (_) {}

          throw new Error(errorMsg);
        }

        alert('KPI updated successfully!');
      } catch (error) {
        console.error('Failed to save KPI:', error);
        alert('Could not save changes. Please try again.\n' + error.message);
      }
    }
  });

  // Approve button functionality
  document.getElementById("Btn-Approve").addEventListener("click", async () => {
    if (!kpi || !kpi._id) {
      alert("KPI data not loaded.");
      return;
    }

    const feedback = document.getElementById("RevEvi-Feedback-text").value.trim();

    kpi.approvalstat = "Approved";

    try {
      const response = await fetch(`http://localhost:3000/api/kpis/${kpi._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvalstat: kpi.approvalstat,
          feedback: feedback  // send only new feedback string here
        }),
      });

      if (!response.ok) throw new Error("Failed to update approval status");

      alert("KPI approved successfully!");
      window.location.href = "manager-view-assigned-kpi.html";
    } catch (error) {
      console.error(error);
      alert("Could not approve KPI. Please try again.");
    }
  });

  // Reject button functionality
  document.getElementById("Btn-Reject").addEventListener("click", async function () {
    if (!kpi || !kpi._id) {
      alert("KPI data not loaded.");
      return;
    }

    // Get feedback from textarea
    const feedback = document.getElementById("RevEvi-Feedback-text").value.trim();

    // Update KPI object
    kpi.approvalstat = "Rejected";
    kpi.feedback = feedback;

    try {
      const response = await fetch(`http://localhost:3000/api/kpis/${kpi._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approvalstat: kpi.approvalstat,
          feedback: kpi.feedback,
        }),
      });

      if (!response.ok) throw new Error("Failed to reject KPI");

      alert("KPI rejected successfully!");
      window.location.href = "manager-view-assigned-kpi.html";
    } catch (error) {
      console.error("Error rejecting KPI:", error);
      alert("Could not reject KPI. Please try again.");
    }
  });
});