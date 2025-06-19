const KPI = require('../models/kpi');
const User = require('../models/user');

exports.getNotifications = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ msg: 'Not logged in' });

    let notifications = [];

    // Upcoming deadlines for all users
    const now = new Date();
    const soon = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // The due date is within the next 3 days
    const userCreatedAt = user.createdAt || new Date(0); // Fallback to epoch if createdAt is not set
    
    // Only show notifications after the user was created
    let deadlineQuery = {};
    if (user.role === 'Staff') {
      deadlineQuery = {
        assignedTo: user._id,
        createdAt: { $gte: userCreatedAt },
        dueDate: { $gte: now, $lte: soon }
      };
    } else if (user.role === 'Manager') {
      // Manager can see all KPIs with upcoming deadlines
      deadlineQuery = {
        createdAt: { $gte: userCreatedAt },
        dueDate: { $gte: now, $lte: soon }
      };
    }
    const upcomingKpis = await KPI.find(deadlineQuery).populate('assignedTo', 'name');
    notifications.push(...upcomingKpis.map(kpi => ({
      type: 'deadline',
      kpiId: kpi._id,
      kpiTitle: kpi.title,
      staff: kpi.assignedTo?.name || '',
      dueDate: kpi.dueDate
    })));

    // For Staff: New KPI assignments (With in the last 1 days)
    if (user.role === 'Staff') {
      const newKpis = await KPI.find({
        assignedTo: user._id,
        createdAt: { $gte: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) }
      });
      notifications.push(...newKpis.map(kpi => ({
        type: 'assigned',
        kpiId: kpi._id,
        kpiTitle: kpi.title
      })));

      // For Staff: New KPI assignments (With in the last 1 days)
      const kpisWithFeedback = await KPI.find({
        assignedTo: user._id,
        'feedback.0': { $exists: true }
      });
      kpisWithFeedback.forEach(kpi => {
        if (kpi.feedback && kpi.feedback.length > 0) {
          const latest = kpi.feedback[kpi.feedback.length - 1];
          if (new Date(latest.date) > new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)) {
            notifications.push({
              type: 'comment',
              kpiId: kpi._id,
              kpiTitle: kpi.title
            });
          }
        }
      });
    }

    // For Manager: Staff KPI progress updates
    if (user.role === 'Manager') {
      const kpisWithProgress = await KPI.find({
        progressUpdates: { $exists: true, $not: { $size: 0 } }
      }).populate('assignedTo', 'name');
      kpisWithProgress.forEach(kpi => {
        kpi.progressUpdates.forEach(update => {
          // Within the last 2 days
          if (update.createdAt && new Date(update.createdAt) > new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)) {
            notifications.push({
              type: 'evidence',
              kpiId: kpi._id,
              kpiTitle: kpi.title,
              staff: kpi.assignedTo?.name || '',
              dueDate: update.createdAt
              
            });
          }
        });
      });
    }

    res.json({ notifications, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};