require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.routes');
const departmentRoutes = require('./routes/department.routes');
const employeeRoutes = require('./routes/employee.routes');

const app = express();

// CORS Configuration - Allowing all origins for development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);

// Health check endpoint
app.get('/health', (req, res) => { //its woirking
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
