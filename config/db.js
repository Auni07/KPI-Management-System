const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/kpi_system');
    console.log(' MongoDB connected');
  } catch (err) {
    console.error(' MongoDB connection failed:', err.message);
    process.exit(1); // Exit if error
  }
};

module.exports = connectDB;
