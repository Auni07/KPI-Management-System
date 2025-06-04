const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  companyId: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['manager', 'staff'],
    required: true
  },

  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  department: {
    type: String,
    enum: [
      'Sales & Marketing',
      'HR & Admin',
      'IT',
      'Customer Service',
      'Account & Finance'
    ],
    default: 'Management' 
  }
});

module.exports = mongoose.model('User', userSchema);
