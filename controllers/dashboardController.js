// controllers/dashboardController.js
const Kpi = require('../models/kpi');
const User = require('../models/user');
const mongoose = require('mongoose');

// Get KPI summary for Manager dashboard cards
exports.getKpiSummary = async (req, res) => {
  try {
    const [total, inProgress, completed, notStarted, pendingApproval] = await Promise.all([
      Kpi.countDocuments(),
      Kpi.countDocuments({ status: 'In Progress' }),
      Kpi.countDocuments({ status: 'Completed' }),
      Kpi.countDocuments({ status: 'Not Started' }),
      Kpi.countDocuments({ approvalstat: 'Pending Approval' })
    ]);

    res.json({
      success: true,
      data: {
        total,
        inProgress,
        completed,
        notStarted,
        pendingApproval
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err });
  }
};

// Get average KPI score per staff (Manager bar chart)
exports.getAverageScoreByStaff = async (req, res) => {
  try {
    const result = await Kpi.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          totalTarget: { $sum: "$targetValue" },
          totalProgress: { $sum: "$progressNumber" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          name: "$userInfo.name",
          averageScore: {
            $cond: [
              { $eq: ["$totalTarget", 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ["$totalProgress", "$totalTarget"] }, 100] }, 2] }
            ]
          }
        }
      }
    ]);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err });
  }
};

// Get current user's assigned KPIs (Staff KPI card list)
exports.getMyKpis = async (req, res) => {
  try {
    const userId = req.user._id;
    const kpis = await Kpi.find({ assignedTo: userId }).select('title dueDate');
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err });
  }
};

// Get KPI status breakdown for current user (Staff pie chart)
exports.getMyKpiStatusSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const [completed, inProgress, notStarted] = await Promise.all([
      Kpi.countDocuments({ assignedTo: userId, status: 'Completed' }),
      Kpi.countDocuments({ assignedTo: userId, status: 'In Progress' }),
      Kpi.countDocuments({ assignedTo: userId, status: 'Not Started' })
    ]);

    res.json({
      success: true,
      data: {
        completed,
        inProgress,
        notStarted
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err });
  }
};

// Get KPI score trend for the current user (Staff line chart)
exports.getMyKpiTrend = async (req, res) => {
  try {
    const userId = req.user._id;
    const pipeline = [
      {
        $match: {
          assignedTo: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: { month: { $month: "$startDate" } },
          avgScore: {
            $avg: {
              $cond: [
                { $eq: ["$targetValue", 0] },
                0,
                { $multiply: [{ $divide: ["$progressNumber", "$targetValue"] }, 100] }
              ]
            }
          }
        }
      },
      {
        $sort: { "_id.month": 1 }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          avgScore: { $round: ["$avgScore", 2] }
        }
      }
    ];

    const trend = await Kpi.aggregate(pipeline);
    res.json({ success: true, data: trend });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err });
  }
};
