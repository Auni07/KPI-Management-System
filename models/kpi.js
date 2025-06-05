const mongoose = require('mongoose');

const kpiSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  target: String,
  targetValue: { type: Number, min: 0, default: 0 },
  progress: String,
  progressNumber: { type: Number, min: 0, default: 0 },
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], required: true },
  approvalstat: { type: String, enum: ['Pending Approval', 'Approved', 'Rejected', 'No New Progress'], required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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

module.exports = mongoose.model('Kpi', kpiSchema);
