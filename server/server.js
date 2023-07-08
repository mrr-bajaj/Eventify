const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events')
const employeeRoutes = require('./routes/employees')

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events',eventRoutes);
app.use('/api/employees',employeeRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
