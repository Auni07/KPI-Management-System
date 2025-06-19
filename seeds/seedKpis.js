const mongoose = require("mongoose");
const Kpi = require("../models/kpi"); 

mongoose.connect("mongodb://localhost:27017/kpi_system");

const kpis = [
  {
    title: "Increase Website Traffic",
    description: "Improve website visits by 30% in Q2.",
    target: "percent increase",
    targetValue: 30,
    progress: "Increase by 10%",
    progressNumber: 10,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-20"),
    status: "In Progress",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b1"),
    feedback: [{ text: "Great work! Keep pushing for higher traffic.", date: new Date("2025-06-04") }],
    progressUpdates: [
      {
        progressInput: "10",
        progressNote: "Current progress reflects 10% increase.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-04"),
      }
    ]
  },
  {
    title: "Launch Email Campaign",
    description: "Send 3 newsletters by end of June.",
    target: "campaigns",
    targetValue: 3,
    progress: "2 campaigns sent",
    progressNumber: 2,
    startDate: new Date("2025-05-20"),
    dueDate: new Date("2025-06-22"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b1"),
    feedback: [{ text: "Looks good, almost there!", date: new Date("2025-06-13") }],
    progressUpdates: [
      {
        progressInput: "2",
        progressNote: "Two campaigns have been sent.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-13"),
      }
    ]
  },
  {
    title: "Automate Daily Backup Script",
    description: "Develop and test a new automated backup solution.",
    target: "percentage of completion",
    targetValue: 100,
    progress: "30% completed",
    progressNumber: 30,
    startDate: new Date("2025-06-05"),
    dueDate: new Date("2025-06-25"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b1"),
    feedback: [{ text: "Good progress, keep iterating on the script.", date: new Date("2025-06-09") }],
    progressUpdates: [
      {
        progressInput: "30",
        progressNote: "Backup script development is 30% complete.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-09"),
      }
    ]
  },
  {
    title: "Publish 5 Blog Articles",
    description: "Create and publish 5 SEO-friendly articles.",
    target: "articles",
    targetValue: 5,
    progress: "Post a total of 5 articles",
    progressNumber: 5,
    startDate: new Date("2025-05-01"),
    dueDate: new Date("2025-06-21"),
    status: "Completed",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b1"),
    feedback: [{ text: "Excellent job completing all articles!", date: new Date("2025-06-09") }],
    progressUpdates: [
      {
        progressInput: "5",
        progressNote: "All 5 articles published.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-09"),
      }
    ]
  },
  {
    title: "Conduct User Feedback Survey",
    description: "Collect at least 100 survey responses.",
    target: "responses",
    targetValue: 100,
    progress: "0 responses collected",
    progressNumber: 0,
    startDate: new Date("2025-06-15"),
    dueDate: new Date("2025-06-23"),
    status: "Not Started",
    approvalstat: "Rejected",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b1"),
    feedback: [{ text: "The survey scope needs re-evaluation.", date: new Date("2025-06-18") }],
  },
  {
    title: "Boost Social Media Followers",
    description: "Increase followers by 500 this month.",
    target: "new followers",
    targetValue: 500,
    progress: "350 new followers",
    progressNumber: 350,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-30"),
    status: "In Progress",
    approvalstat: "Rejected",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b2"),
    feedback: [{ text: "Rejected due to insufficient evidence. Please provide more details.", date: new Date("2025-06-13") }],
    progressUpdates: [
      {
        progressInput: "350",
        progressNote: "Currently at 350 new followers.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-13"),
      }
    ]
  },
  {
    title: "Design New Promotional Banner",
    description: "Create 3 new banners for homepage.",
    target: "banners",
    targetValue: 3,
    progress: "No banners created yet",
    progressNumber: 0,
    startDate: new Date("2025-05-19"),
    dueDate: new Date("2025-06-18"),
    status: "Not Started",
    approvalstat: "No New Progress",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b2"),
    feedback: [{ text: "No progress recorded yet. Please provide updates.", date: new Date("2025-06-18") }],
  },
  {
    title: "Update Product Brochures",
    description: "Revise brochures for top 5 products.",
    target: "updated brochures",
    targetValue: 5,
    progress: "Post 5 updated brochures",
    progressNumber: 5,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-24"),
    status: "Completed",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b2"),
    feedback: [{ text: "Brochures look great, well done!", date: new Date("2025-06-09") }],
    progressUpdates: [
      {
        progressInput: "5",
        progressNote: "All 5 brochures have been updated.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-09"),
      }
    ]
  },
  {
    title: "Plan Q3 Marketing Strategy",
    description: "Submit comprehensive strategy plan.",
    target: "percent completed",
    targetValue: 100,
    progress: "Draft completed",
    progressNumber: 70,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-25"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b2"),
    feedback: [{ text: "Good draft, awaiting final review.", date: new Date("2025-06-16") }],
    progressUpdates: [
      {
        progressInput: "70",
        progressNote: "Draft of Q3 marketing strategy completed.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-16"),
      }
    ]
  },
  {
    title: "Deploy System Update v2.0",
    description: "Complete system update rollout.",
    target: "percent completion",
    targetValue: 100,
    progress: "10% completed",
    progressNumber: 10,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-26"),
    status: "In Progress",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b3"),
    feedback: [{ text: "Keep up the momentum, smooth deployment so far.", date: new Date("2025-06-16") }],
    progressUpdates: [
      {
        progressInput: "10",
        progressNote: "10% of system update deployed.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-16"),
      }
    ]
  },
  {
    title: "Prepare System Documentation",
    description: "Create technical documentation for updates.",
    target: "percent completion",
    targetValue: 100,
    progress: "Draft completed",
    progressNumber: 50,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-28"),
    status: "In Progress",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b3"),
    feedback: [{ text: "Documentation is clear, continue with remaining sections.", date: new Date("2025-06-09") }],
    progressUpdates: [
      {
        progressInput: "50",
        progressNote: "Draft of documentation is 50% complete.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-09"),
      }
    ]
  },
  {
    title: "Optimize Server Performance",
    description: "Reduce server response time by 20%.",
    target: "percent reduction",
    targetValue: 20,
    progress: "10% reduction achieved",
    progressNumber: 10,
    startDate: new Date("2025-04-01"),
    dueDate: new Date("2025-06-25"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b3"),
    feedback: [{ text: "Good initial improvement, monitor for further optimization.", date: new Date("2025-06-04") }],
    progressUpdates: [
      {
        progressInput: "10",
        progressNote: "Server response time reduced by 10%.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-04"),
      }
    ]
  },
  {
    title: "Conduct System Security Audit",
    description: "Complete internal security assessment.",
    target: "percent completion",
    targetValue: 100,
    progress: "0% in progress",
    progressNumber: 0,
    startDate: new Date("2025-06-11"),
    dueDate: new Date("2025-06-30"),
    status: "Not Started",
    approvalstat: "No New Progress",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b3"),
    feedback: [{ text: "No updates since last check. Please initiate the audit.", date: new Date("2025-06-18") }],
  },
  {
    title: "Fix Reported System Bugs",
    description: "Resolve all open bugs from May report.",
    target: "open bugs resolved",
    targetValue: 100,
    progress: "A total of 10 bugs fixed",
    progressNumber: 10,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-22"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b3"),
    feedback: [{ text: "Good progress on bug fixes, prioritize critical ones.", date: new Date("2025-06-09") }],
    progressUpdates: [
      {
        progressInput: "10",
        progressNote: "10 bugs resolved.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-09"),
      }
    ]
  },
  {
    title: "Launch New Marketing Campaign",
    description: "Deploy a social media campaign targeting Gen Z audience.",
    target: "engagements reached",
    targetValue: 50000,
    progress: "20k engagements",
    progressNumber: 20000,
    startDate: new Date("2025-06-05"),
    dueDate: new Date("2025-07-05"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b1"),
    feedback: [{ text: "Campaign gaining traction, monitor engagement rates closely.", date: new Date("2025-06-04") }],
    progressUpdates: [
      {
        progressInput: "20000",
        progressNote: "Achieved 20k engagements.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-04"),
      }
    ]
  },
  {
    title: "SEO Optimization",
    description: "Improve organic search ranking for 5 key pages.",
    target: "- in ranking",
    targetValue: 3,
    progress: "2 pages in Top 3",
    progressNumber: 2,
    startDate: new Date("2025-06-10"),
    dueDate: new Date("2025-07-10"),
    status: "In Progress",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b1"),
    feedback: [{ text: "Good progress on SEO, continue targeting the remaining pages.", date: new Date("2025-06-04") }],
    progressUpdates: [
      {
        progressInput: "2",
        progressNote: "Two key pages are now in the top 3 search ranking.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-04"),
      }
    ]
  },
  {
    title: "Email Subscriber Growth",
    description: "Increase mailing list subscribers by 5000.",
    target: "new subscribers",
    targetValue: 5000,
    progress: "1500 subscribers",
    progressNumber: 1500,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-30"),
    status: "Not Started",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b1"),
    feedback: [{ text: "No new subscribers yet. Focus on promotional activities.", date: new Date("2025-06-18") }],
  },
  {
    title: "Website UI/UX Redesign",
    description: "Complete redesign of key website pages for improved user experience.",
    target: "pages redesigned",
    targetValue: 5,
    progress: "2 pages redesigned",
    progressNumber: 2,
    startDate: new Date("2025-06-10"),
    dueDate: new Date("2025-07-15"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b1"),
    feedback: [{ text: "Designs look promising, keep gathering user feedback.", date: new Date("2025-06-18") }],
    progressUpdates: [
      {
        progressInput: "2",
        progressNote: "Two key pages have been redesigned.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-18"),
      }
    ]
  },
  {
    title: "Content Marketing Strategy Development",
    description: "Develop a comprehensive content marketing strategy for Q3.",
    target: "strategy completion",
    targetValue: 100,
    progress: "50% completed",
    progressNumber: 50,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-30"),
    status: "In Progress",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b1"),
    feedback: [{ text: "Good outline for the strategy. Flesh out the details.", date: new Date("2025-06-18") }],
    progressUpdates: [
      {
        progressInput: "50",
        progressNote: "Content marketing strategy draft is 50% complete.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-18"),
      }
    ]
  },
  {
    title: "Improve Customer Retention",
    description: "Reduce churn rate by 5%.",
    target: "percent reduction",
    targetValue: 5,
    progress: "1% reduction",
    progressNumber: 1,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-30"),
    status: "In Progress",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b2"),
    feedback: [{ text: "A good start, analyze feedback for further improvements.", date: new Date("2025-06-16") }],
    progressUpdates: [
      {
        progressInput: "1",
        progressNote: "Achieved 1% churn reduction.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-16"),
      }
    ]
  },
  {
    title: "New Product Feature Rollout",
    description: "Deploy feature X to 100% of users.",
    target: "percent deployment",
    targetValue: 100,
    progress: "50% deployment",
    progressNumber: 50,
    startDate: new Date("2025-06-10"),
    dueDate: new Date("2025-06-25"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b2"),
    feedback: [{ text: "Halfway there, ensure smooth transition for remaining users.", date: new Date("2025-06-09") }],
    progressUpdates: [
      {
        progressInput: "50",
        progressNote: "Feature X deployed to 50% of users.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-09"),
      }
    ]
  },
  {
    title: "Conduct Customer Feedback Survey",
    description: "Gather feedback from 500 customers.",
    target: "responses",
    targetValue: 500,
    progress: "300 responses", 
    progressNumber: 300, 
    startDate: new Date("2025-06-05"),
    dueDate: new Date("2025-06-20"),
    status: "Completed",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b2"),
    feedback: [{ text: "Excellent response rate, now analyze the insights.", date: new Date("2025-06-13") }],
    progressUpdates: [
      {
        progressInput: "300",
        progressNote: "300 customer feedback responses gathered.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-13"),
      }
    ]
  },
  {
    title: "Create Monthly Newsletter",
    description: "Publish June edition of the newsletter.",
    target: "edition",
    targetValue: 100,
    progress: "Draft completed",
    progressNumber: 30,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-15"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b2"),
    feedback: [{ text: "Draft looks good, proceed with final content and design.", date: new Date("2025-06-13") }],
    progressUpdates: [
      {
        progressInput: "30",
        progressNote: "Newsletter draft completed.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-13"),
      }
    ]
  },
  {
    title: "Market Research for New Product",
    description: "Conduct market research and compile a report for potential new product.",
    target: "report completion",
    targetValue: 100,
    progress: "40% completed",
    progressNumber: 40,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-07-01"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b2"),
    feedback: [{ text: "Good progress on data collection, start analyzing key findings.", date: new Date("2025-06-18") }],
    progressUpdates: [
      {
        progressInput: "40",
        progressNote: "Market research data collection is 40% complete.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-18"),
      }
    ]
  },
  {
    title: "Partnership Outreach Program",
    description: "Initiate contact with 10 potential strategic partners.",
    target: "partners contacted",
    targetValue: 10,
    progress: "3 partners contacted",
    progressNumber: 3,
    startDate: new Date("2025-06-10"),
    dueDate: new Date("2025-07-05"),
    status: "In Progress",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b2"),
    feedback: [{ text: "Good start, follow up on initial contacts.", date: new Date("2025-06-18") }],
    progressUpdates: [
      {
        progressInput: "3",
        progressNote: "Contact initiated with 3 potential partners.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-18"),
      }
    ]
  },
  {
    title: "Boost Social Media Followers",
    description: "Gain 10,000 new followers on Instagram.",
    target: "new followers",
    targetValue: 10000,
    progress: "4,000 followers",
    progressNumber: 4000,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-30"),
    status: "In Progress",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b3"),
    feedback: [{ text: "Impressive growth, keep engaging your audience.", date: new Date("2025-06-16") }],
    progressUpdates: [
      {
        progressInput: "4000",
        progressNote: "Gained 4,000 new followers.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-16"),
      }
    ]
  },
  {
    title: "Create New Product Videos",
    description: "Produce 3 promotional videos.",
    target: "videos",
    targetValue: 3,
    progress: "1 video completed",
    progressNumber: 1,
    startDate: new Date("2025-06-05"),
    dueDate: new Date("2025-06-25"),
    status: "In Progress",
    approvalstat: "Rejected",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b3"),
    feedback: [{ text: "Rejected. Please provide clear evidence of video completion.", date: new Date("2025-06-04") }],
    progressUpdates: [
      {
        progressInput: "1",
        progressNote: "One product video completed.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-04"),
      }
    ]
  },
  {
    title: "Host a Webinar",
    description: "Organize and host an online session for 200 attendees.",
    target: "attendees",
    targetValue: 200,
    progress: "Webinar scheduled",
    progressNumber: 200,
    startDate: new Date("2025-06-10"),
    dueDate: new Date("2025-06-28"),
    status: "Completed",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b3"),
    feedback: [{ text: "Webinar was a success! Good attendance.", date: new Date("2025-06-04") }],
    progressUpdates: [
      {
        progressInput: "200",
        progressNote: "Webinar successfully hosted with 200 attendees.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-04"),
      }
    ]
  },
  {
    title: "Update Website Content",
    description: "Revamp the 'About Us' and 'Services' sections.",
    target: "content updated",
    targetValue: 20,
    progress: "20 completed",
    progressNumber: 100,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-20"),
    status: "Completed",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b3"),
    feedback: [{ text: "Content is refreshed and engaging. Well done!", date: new Date("2025-06-09") }],
    progressUpdates: [
      {
        progressInput: "100",
        progressNote: "Website content updated to 100%.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-09"),
      }
    ]
  },
  {
    title: "Database Migration to Cloud",
    description: "Migrate existing on-premise database to cloud-based solution.",
    target: "percent migrated",
    targetValue: 100,
    progress: "25% migrated",
    progressNumber: 25,
    startDate: new Date("2025-06-10"),
    dueDate: new Date("2025-07-30"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b3"),
    feedback: [{ text: "Initial migration steps are good, continue rigorous testing.", date: new Date("2025-06-18") }],
    progressUpdates: [
      {
        progressInput: "25",
        progressNote: "25% of the database has been migrated to the cloud.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-18"),
      }
    ]
  },
  {
    title: "Develop Internal Training Module",
    description: "Create a new training module for employee onboarding.",
    target: "module completion",
    targetValue: 100,
    progress: "60% completed",
    progressNumber: 60,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-25"),
    status: "In Progress",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b3"),
    feedback: [{ text: "Module content is coming along well. Focus on interactive elements.", date: new Date("2025-06-18") }],
    progressUpdates: [
      {
        progressInput: "60",
        progressNote: "Training module development is 60% complete.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-18"),
      }
    ]
  },
  {
    title: "Complete Q2 Sales Report",
    description: "Finalize and submit the quarterly sales performance report.",
    target: "percentage of completion",
    targetValue: 100,
    progress: "100% completed",
    progressNumber: 100,
    startDate: new Date("2025-05-15"),
    dueDate: new Date("2025-06-05"),
    status: "Completed",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b4"),
    feedback: [{ text: "Report is comprehensive and well-presented. Excellent!", date: new Date("2025-06-13") }],
    progressUpdates: [
      {
        progressInput: "100",
        progressNote: "Q2 Sales Report finalized and submitted.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-13"),
      }
    ]
  },
  // Ali - Rejected KPI 1
  {
    title: "Implement New IT Security Protocol",
    description: "Roll out MFA across all staff accounts.",
    target: "percent MFA adoption",
    targetValue: 80,
    progress: "50% completed",
    progressNumber: 50,
    startDate: new Date("2025-05-20"),
    dueDate: new Date("2025-06-10"),
    status: "In Progress",
    approvalstat: "Rejected", // Rejected due to scope changes
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b4"),
    feedback: [{ text: "Rejected. Scope of MFA rollout has changed. Re-evaluate target.", date: new Date("2025-06-04") }],
    progressUpdates: [
      {
        progressInput: "50",
        progressNote: "MFA rollout is 50% complete.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-04"),
      }
    ]
  },
  // Ali - Rejected KPI 2
  {
    title: "Update Server Maintenance Logs",
    description: "Ensure all server maintenance activities are documented.",
    target: "percent log accuracy",
    targetValue: 100,
    progress: "75% completed",
    progressNumber: 75,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-15"),
    status: "In Progress",
    approvalstat: "Rejected", // Rejected due to incomplete details
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b4"),
    feedback: [{ text: "Rejected. Log details are incomplete. Provide more comprehensive entries.", date: new Date("2025-06-09") }],
    progressUpdates: [
      {
        progressInput: "75",
        progressNote: "75% of server maintenance activities documented.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-09"),
      }
    ]
  },
  // Ali - Pending KPI 1
  {
    title: "Automate Daily Backup Script",
    description: "Develop and test a new automated backup solution.",
    target: "percentage of completion",
    targetValue: 100,
    progress: "30% completed",
    progressNumber: 30,
    startDate: new Date("2025-06-05"),
    dueDate: new Date("2025-06-25"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b4"),
    feedback: [{ text: "Script development is on track. Continue with testing phase.", date: new Date("2025-06-09") }],
    progressUpdates: [
      {
        progressInput: "30",
        progressNote: "Backup script development is 30% complete.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-09"),
      }
    ]
  },
  // Ali - Pending KPI 2
  {
    title: "Conduct Cybersecurity Training",
    description: "Organize and deliver a training session for new hires.",
    target: "session completed",
    targetValue: 7,
    progress: "0% completed",
    progressNumber: 0,
    startDate: new Date("2025-06-10"),
    dueDate: new Date("2025-06-30"),
    status: "Not Started",
    approvalstat: "Rejected",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b4"),
    feedback: [{ text: "Training plan needs revision before approval.", date: new Date("2025-06-18") }],
  },
  {
    title: "Network Infrastructure Upgrade",
    description: "Upgrade network hardware in main office.",
    target: "percent upgraded",
    targetValue: 100,
    progress: "20% completed",
    progressNumber: 20,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-07-20"),
    status: "In Progress",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b4"),
    feedback: [{ text: "Initial phase of hardware upgrade is successful.", date: new Date("2025-06-18") }],
    progressUpdates: [
      {
        progressInput: "20",
        progressNote: "20% of network hardware upgraded.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-18"),
      }
    ]
  },
  {
    title: "Develop Disaster Recovery Plan",
    description: "Create a comprehensive disaster recovery plan for critical systems.",
    target: "plan completion",
    targetValue: 100,
    progress: "30% completed",
    progressNumber: 30,
    startDate: new Date("2025-06-10"),
    dueDate: new Date("2025-07-25"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b4"),
    feedback: [{ text: "Good initial draft of the recovery plan. Include more detailed scenarios.", date: new Date("2025-06-18") }],
    progressUpdates: [
      {
        progressInput: "30",
        progressNote: "Disaster recovery plan is 30% complete.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-18"),
      }
    ]
  },
  // --- KPIs for Aliya Natasha (ID: 6659fa9fb6e1c2cf81e362b5) ---

  // Aliya - Approved KPI
  {
    title: "Achieve Q2 Sales Target (Aliya)",
    description: "Close 15 new client contracts.",
    target: "contracts",
    targetValue: 15,
    progress: "15 contracts closed",
    progressNumber: 15,
    startDate: new Date("2025-05-01"),
    dueDate: new Date("2025-06-30"),
    status: "Completed",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b5"),
    feedback: [{ text: "Fantastic work closing all 15 contracts!", date: new Date("2025-06-13") }],
    progressUpdates: [
      {
        progressInput: "15",
        progressNote: "Successfully closed 15 new client contracts.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-13"),
      }
    ]
  },
  // Aliya - Rejected KPI 1
  {
    title: "Develop New Marketing Campaign",
    description: "Create and launch a social media campaign for product X.",
    target: "campaign launch",
    targetValue: 30,
    progress: "100% completed",
    progressNumber: 20,
    startDate: new Date("2025-05-25"),
    dueDate: new Date("2025-06-18"),
    status: "In Progress",
    approvalstat: "Rejected", // Rejected due to budget constraints
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b5"),
    feedback: [{ text: "Rejected. Campaign budget has been reallocated.", date: new Date("2025-06-10") }],
    progressUpdates: [
      {
        progressInput: "30",
        progressNote: "Marketing campaign development is 100% complete.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-10"),
      }
    ]
  },
  // Aliya - Rejected KPI 2
  {
    title: "Organize Client Feedback Session",
    description: "Host a webinar to gather feedback from key clients.",
    target: "successful session",
    targetValue: 10,
    progress: "100% completed",
    progressNumber: 8,
    startDate: new Date("2025-06-03"),
    dueDate: new Date("2025-06-12"),
    status: "Completed",
    approvalstat: "Rejected", // Rejected due to low attendance
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b5"),
    feedback: [{ text: "Rejected. Session attendance was below target.", date: new Date("2025-06-04") }],
    progressUpdates: [
      {
        progressInput: "10",
        progressNote: "Client feedback session completed.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-04"),
      }
    ]
  },
  // Aliya - Pending KPI 1
  {
    title: "Prepare for Annual Sales Review",
    description: "Consolidate all sales data and presentations for review.",
    target: "percent completion",
    targetValue: 100,
    progress: "20% completed",
    progressNumber: 20,
    startDate: new Date("2025-06-08"),
    dueDate: new Date("2025-06-28"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b5"),
    feedback: [{ text: "Review data looks good so far. Keep consolidating.", date: new Date("2025-06-16") }],
    progressUpdates: [
      {
        progressInput: "20",
        progressNote: "Sales review preparation is 20% complete.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-16"),
      }
    ]
  },
  // Aliya - Pending KPI 2
  {
    title: "Lead Generation Initiative",
    description: "Identify and contact 50 potential new leads.",
    target: "qualified leads",
    targetValue: 50,
    progress: "10 leads identified",
    progressNumber: 10,
    startDate: new Date("2025-06-15"),
    dueDate: new Date("2025-07-05"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b5"),
    feedback: [{ text: "Good start on lead identification. Focus on qualification criteria.", date: new Date("2025-06-01") }],
    progressUpdates: [
      {
        progressInput: "10",
        progressNote: "10 new leads identified for generation initiative.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-01"),
      }
    ]
  },
  {
    title: "Client Relationship Management Training",
    description: "Attend and complete a CRM training program.",
    target: "training completion",
    targetValue: 100,
    progress: "50% completed",
    progressNumber: 50,
    startDate: new Date("2025-06-01"),
    dueDate: new Date("2025-06-25"),
    status: "In Progress",
    approvalstat: "Approved",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b5"),
    feedback: [{ text: "Good progress on the CRM training. Apply learned concepts.", date: new Date("2025-06-18") }],
    progressUpdates: [
      {
        progressInput: "50",
        progressNote: "CRM training program is 50% completed.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-18"),
      }
    ]
  },
  {
    title: "Sales Process Optimization",
    description: "Analyze and optimize the current sales funnel for efficiency.",
    target: "optimization report",
    targetValue: 100,
    progress: "30% completed",
    progressNumber: 30,
    startDate: new Date("2025-06-10"),
    dueDate: new Date("2025-07-10"),
    status: "In Progress",
    approvalstat: "Pending",
    assignedTo: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b5"),
    feedback: [{ text: "Initial analysis looks promising. Identify key areas for improvement.", date: new Date("2025-06-18") }],
    progressUpdates: [
      {
        progressInput: "30",
        progressNote: "Sales process optimization analysis is 30% complete.",
        file: { filePath: "uploads\\kpi_evidence\\6852a8a86ce1e51c493f535a-1750249229443.pdf", fileNote: "Evidence 1" },
        createdAt: new Date("2025-06-18"),
      }
    ]
  },
];

Kpi.insertMany(kpis)
  .then(() => {
    console.log("KPIs seeded!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });