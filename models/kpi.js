const mongoose = require('mongoose');

const progressUpdateSchema = new mongoose.Schema({
  progressInput: { type: String },
  progressNote: { type: String },
  file: {
    filePath: { type: String },
    fileNote: { type: String }
  },
  createdAt: { //current date
    type: Date,
    default: Date.now
  }
});

const kpiSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  target: { //indicator + target value
    type: String
  },
  targetValue: {
    type: Number,
    min: 0,
    default: 0
  },
  progress: {
    type: String
  },
  progressNumber: {
    type: Number,
    min: 0,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    required: true
  },
  approvalstat: {
    type: String,
    enum: ['Pending Approval', 'Approved', 'Rejected', 'No New Progress'],
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  progressUpdates: [progressUpdateSchema]
});

module.exports = mongoose.model('Kpi', kpiSchema);
