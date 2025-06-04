
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

    const selectedKpi = kpiData.find(kpi => kpi.id === kpiId);

    if (selectedKpi) {
        document.getElementById('kpiTitle').textContent = selectedKpi.title;
        document.getElementById('kpiDescription').textContent = selectedKpi.description;
        document.getElementById('kpiTarget').textContent = selectedKpi.target;
        document.getElementById('kpiProgress').textContent = selectedKpi.progress;
        document.getElementById('kpiCompletion').textContent = selectedKpi.progress;
        document.getElementById('kpiStartDate').textContent = selectedKpi.startDate;
        document.getElementById('kpiDueDate').textContent = selectedKpi.dueDate;
        document.getElementById('kpiStatus').textContent = selectedKpi.status;
    
        // Check if status is Completed
        if (selectedKpi.status === "Completed") {
            // Hide the form
            document.getElementById('updateFormCard').style.display = "none";
    
            // Create a congratulatory message
            const congratsMessage = document.createElement("div");
            congratsMessage.classList.add("alert", "alert-success", "mt-3");
            congratsMessage.textContent = "\Congratulations! You've successfully completed this KPI.";
    
            // Append message to the card body
            document.querySelector(".card-body").appendChild(congratsMessage);
        }
    } else {
        alert("KPI not found");
    }    

    // Get the form and submit button
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();  // Prevent default form submission

        // Save progress updated status in localStorage
        localStorage.setItem('progressUpdated', 'true');

        // Redirect to staff-view-kpi.html
        window.location.href = 'staff-view-kpi.html';
    });


