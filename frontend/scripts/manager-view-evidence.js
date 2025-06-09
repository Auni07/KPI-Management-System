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
      // Switch to input mode
      const currentValue = actualSpan.textContent.trim();
      const input = document.createElement("input");
      input.type = "number";
      input.min = 0;
      input.max = targetValue;
      input.value = currentValue || 0;
      
      actualSpan.innerHTML = '';  // Clear current value display
      actualSpan.appendChild(input);  // Append input box
      this.innerText = "Done";  // Change button label
    } else {
      // Done editing - get input value
      const input = actualSpan.querySelector("input");
      if (!input) return;  // safety check

      const newValue = parseFloat(input.value);

      // Validation
      if (isNaN(newValue) || newValue < 0 || newValue > targetValue) {
        alert(`Please enter a number between 0 and ${targetValue}`);
        return;
      }

      // Update the display
      actualSpan.textContent = newValue;

      // Update KPI object properties
      kpi.progressNumber = newValue; // not currentValue

      // Update progress status
      const progressPercentage = newValue / targetValue;
      if (progressPercentage === 1) {
        kpi.progressStatus = "Completed";
      } else if (progressPercentage > 0) {
        kpi.progressStatus = "In Progress";
      } else {
        kpi.progressStatus = "Not Started";
      }

      this.innerText = "Edit";

      // Send updated KPI to server
      try {console.log('Sending updated KPI:', kpi);
        const response = await fetch(`http://localhost:3000/api/kpis/${kpi._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(kpi),
        });
        if (!response.ok) throw new Error('Update failed');
        alert('KPI updated successfully!');
      } catch (error) {
        console.error('Failed to save KPI:', error);
        alert('Could not save changes. Please try again.');
      }
    }
  });

  // Approve button functionality
  document.getElementById("Btn-Approve").addEventListener("click", async () => {
  if (!kpi || !kpi._id) {
    alert("KPI data not loaded.");
    return;
  }

  // Get feedback from textarea
  const feedback = document.getElementById("RevEvi-Feedback-text").value.trim();

  // Update your KPI object accordingly
  kpi.approvalstat = "Approved";
  kpi.feedback = feedback;  // Add feedback field here

  try {
    const response = await fetch(`http://localhost:3000/api/kpis/${kpi._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        approvalstat: kpi.approvalstat,
        feedback: kpi.feedback,  // send feedback in the update
      }),
    });

    if (!response.ok) throw new Error("Failed to update approval status");

    alert("KPI approved successfully!");
    window.location.href = "manager-view-assigned-kpi.html";
  } catch (error) {
    console.error(error);
    alert("Could not approve KPI. Please try again.");
  }

  // Update the approvalstat field in the kpi object
  kpi.approvalstat = "Approved";

  try {
    const response = await fetch(`http://localhost:3000/api/kpis/${kpi._id}`, {
      method: "PUT",  // or PATCH depending on your backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ approvalstat: kpi.approvalstat }),
    });

    if (!response.ok) throw new Error("Failed to update approval status");

    alert("KPI approved successfully!");
    // Redirect to the assigned KPI list page
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