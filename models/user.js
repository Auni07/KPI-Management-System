const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({

  name: { type: String, required: true },

  email: { type: String, required: true, unique: true, lowercase: true, trim: true },

  phone: { type: String, required: true, trim: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ['Manager', 'Staff'],
    required: true
  },

  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  department: {
    type: String,
    enum: ['Sales & Marketing', 'HR & Admin', 'IT', 'Customer Service', 'Account & Finance'],
    required: true  
  }
}, { timestamps: true });

userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ id: this._id, role: this.role }, 
    process.env.JWT_SECRET, 
    {expiresIn: '1h'}
  );
};

userSchema.methods.isManager = function() {
  return this.role === 'Manager';
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
