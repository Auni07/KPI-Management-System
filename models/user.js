const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
 // _id: mongoose.Schema.Types.ObjectId,
  companyId: {type: String, required: true},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['manager', 'staff'], required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  department: { type: String, enum: ['Sales & Marketing', 'HR & Admin', 'IT', 'Customer Service', 'Account & Finance', null], default: null },
}, { timestamps: true });

// --- CHANGE THIS PART ---
// 密码加密
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});



// models/user.js
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password); // 比对密码
};




// 生成 JWT Token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ id: this._id, role: this.role }, 'your_jwt_secret', { expiresIn: '1h' });
};

// 根据用户角色（manager/staff）来管理不同权限
userSchema.methods.isManager = function() {
  return this.role === 'manager';
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
// --- END CHANGE ---