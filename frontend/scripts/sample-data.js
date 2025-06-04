// Sample KPI data loaded into manager-view-kpi.html, manager-view-evidence.html, and manager-kpi-detail.html
const sampleKPIs = [
  {
    id: "kpi-1",
    title: "Customer Satisfaction",
    description: "Improve customer support ratings.",
    staffName: "Ainul Husna",
    department: "Customer Service",
    targetValue: 90, // numeric value instead of "90%"
    currentValue: 0,
    dueDate: "2025-06-30",
    performanceIndicator: "CSAT survey scores",
    status: "Pending",
    progressStatus: "Not Started",
    evidence: [
      {
        date: "2025-04-05",
        description: "Submitted sales report",
        file: "example.pdf",
        status: "Pending",
      },
    ],
  },
  {
    id: "kpi-2",
    title: "Website Uptime",
    description: "Maintain 99.9% uptime for Q2.",
    staffName: "Harith Ismail",
    department: "IT",
    targetValue: 99.9, // numeric value instead of "99.9%"
    currentValue: 65,
    dueDate: "2025-12-30",
    performanceIndicator: "Server monitoring logs",
    status: "Approved",
    progressStatus: "In Progress",
    evidence: [
      {
        date: "2025-04-05",
        description: "Submitted server logs",
        file: "example.pdf",
        status: "Approved",
      },
    ],
  },
  {
    id: "kpi-3",
    title: "Increase sales by 20%",
    description: "Get 20 orders",
    staffName: "Harry Potter",
    department: "Sales",
    targetValue: 20, // numeric value instead of "20%"
    currentValue: 15,
    dueDate: "2025-09-30",
    performanceIndicator: "Monthly sales report",
    status: "Pending",
    progressStatus: "In Progress",
    evidence: [
      {
        date: "2025-04-01",
        description: "Submitted sales report",
        file: "example2.pdf",
        status: "Pending",
      },
    ],
  },
  {
    id: "kpi-4",
    title: "Product Launch",
    description: "Launch new product in Q3.",
    staffName: "Haziq Rahman",
    department: "Sales",
    targetValue: 1, // 1 represents 'Launch completed'
    currentValue: 1,
    dueDate: "2025-07-15",
    performanceIndicator: "Product development milestones",
    status: "Approved",
    progressStatus: "Completed",
    evidence: [
      {
        date: "2025-04-10",
        description: "Product development completed",
        file: "product_report.pdf",
        status: "Approved",
      },
    ],
  },
  {
    id: "kpi-5",
    title: "Employee Training",
    description: "Conduct training sessions for the sales team.",
    staffName: "Nur Aina",
    department: "HR",
    targetValue: 100, // 100% attendance → 100
    currentValue: 0,
    dueDate: "2025-06-15",
    performanceIndicator: "Training attendance sheets",
    status: "Pending",
    progressStatus: "Not Started",
    evidence: [
      {
        date: "2025-04-12",
        description: "Scheduled training sessions",
        file: "training_schedule.pdf",
        status: "Pending",
      },
    ],
  },
  {
    id: "kpi-6",
    title: "Reduce Customer Complaints",
    description: "Reduce complaints by 30%",
    staffName: "Ainul Husna",
    department: "Customer Service",
    targetValue: 30, // numeric value instead of "30%"
    currentValue: 0,
    dueDate: "2025-07-2",
    performanceIndicator: "Customer feedback records",
    status: "Rejected",
    progressStatus: "Not Started",
    evidence: [
      {
        date: "2025-04-10",
        description: "Submitted complaint analysis",
        file: "example.pdf",
        status: "Rejected",
      },
    ],
  }
];

