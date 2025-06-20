const KPI = require("../models/kpi");
const User = require("../models/user");

exports.getNotifications = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ msg: "Not logged in" });

    let notifications = [];

    // Upcoming deadlines for all users
    const now = new Date();
    const soon = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // The due date is within the next 3 days

    // Get the earliest KPI createdAt in the database
    const earliestKpi = await KPI.findOne()
      .sort({ createdAt: 1 })
      .select("createdAt");
    const earliestKpiCreatedAt = earliestKpi
      ? earliestKpi.createdAt
      : new Date(0);

    // Determine whether the user is newly registered
    const isNewUser = user.createdAt && user.createdAt > earliestKpiCreatedAt;

    // Only show notifications after the user was created
    let deadlineQuery = {};
    if (user.role === "Staff") {
      deadlineQuery = {
        assignedTo: user._id,
        dueDate: { $gte: now, $lte: soon },
      };
      if (isNewUser) {
        deadlineQuery.createdAt = { $gte: user.createdAt };
      }
    } else if (user.role === "Manager") {
      deadlineQuery = {
        dueDate: { $gte: now, $lte: soon },
      };
      if (isNewUser) {
        deadlineQuery.createdAt = { $gte: user.createdAt };
      }
    }
    const upcomingKpis = await KPI.find(deadlineQuery).populate(
      "assignedTo",
      "name"
    );
    notifications.push(
      ...upcomingKpis.map((kpi) => ({
        type: "deadline",
        kpiId: kpi._id,
        kpiTitle: kpi.title,
        staff: kpi.assignedTo?.name || "",
        dueDate: kpi.dueDate,
      }))
    );

    // For Staff: New KPI assignments (With in the last 3 days)
    if (user.role === "Staff") {
      let assignedKpiQuery = {
        assignedTo: user._id,
        createdAt: { $gte: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
      };
      if (isNewUser) {
        assignedKpiQuery.createdAt.$gte = new Date(
          Math.max(user.createdAt, assignedKpiQuery.createdAt.$gte)
        );
      }
      const newKpis = await KPI.find(assignedKpiQuery);
      notifications.push(
        ...newKpis.map((kpi) => ({
          type: "assigned",
          kpiId: kpi._id,
          kpiTitle: kpi.title,
        }))
      );

      // For Staff: New KPI feedback (With in the last 3 days)
      const kpisWithFeedback = await KPI.find({
        assignedTo: user._id,
        "feedback.0": { $exists: true },
      });
      kpisWithFeedback.forEach((kpi) => {
        if (kpi.feedback && kpi.feedback.length > 0) {
          const latest = kpi.feedback[kpi.feedback.length - 1];
          if (
            new Date(latest.date) >
            new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
          ) {
            if (!isNewUser || new Date(kpi.createdAt) >= user.createdAt) {
              notifications.push({
                type: "comment",
                kpiId: kpi._id,
                kpiTitle: kpi.title,
              });
            }
          }
        }
      });
    }

    // For Manager: Staff KPI progress updates
    if (user.role === "Manager") {
      let kpiProgressQuery = {
        progressUpdates: { $exists: true, $not: { $size: 0 } },
      };
      if (isNewUser) {
        kpiProgressQuery.createdAt = { $gte: user.createdAt };
      }
      const kpisWithProgress = await KPI.find(kpiProgressQuery).populate(
        "assignedTo",
        "name"
      );
      kpisWithProgress.forEach((kpi) => {
        kpi.progressUpdates.forEach((update) => {
          // Within the last 3 days
          if (
            update.createdAt &&
            new Date(update.createdAt) >
              new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
          ) {
            notifications.push({
              type: "evidence",
              kpiId: kpi._id,
              kpiTitle: kpi.title,
              staff: kpi.assignedTo?.name || "",
              dueDate: update.createdAt,
            });
          }
        });
      });
    }

    res.json({ notifications, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
