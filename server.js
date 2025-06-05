require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/kpi_system';

// Enable CORS for all routes and origins
// Without this, browser security policies (CORS) would block cross-origin requests
app.use(cors());

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection failed:', err));

// Middleware
app.use(express.json());

// Routes
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/kpi', require('./routes/kpiRoutes'));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));