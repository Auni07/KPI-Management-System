const mongoose = require('mongoose');

const kpiSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  target: String,
  targetValue: { type: Number, min: 0, default: 0 },
  progress: String,
  progressNumber: { type: Number, min: 0, default: 0 },
  startDate: { type: Date },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], required: true },
  approvalstat: { type: String, enum: ['Pending Approval', 'Approved', 'Rejected'], required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback: { type: String, default: ""},

  progressUpdates: [
    {
      progressInput: String,
      progressNote: String,
      file: {
        filePath: String,
        fileNote: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});
// --- CHANGE THIS PART ---
// Instead of directly exporting mongoose.model('Kpi', kpiSchema),
// check if the model already exists.
module.exports = mongoose.models.Kpi || mongoose.model('Kpi', kpiSchema);
// --- END CHANGE ---