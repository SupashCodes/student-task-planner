const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Student Task & Study Planner API is running' });
});

// Database connection helper (supports both local and serverless Vercel)
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_planner';
  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('Successfully connected to MongoDB.');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
  }
};

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// For local development, listen on PORT
const PORT = process.env.PORT || 5001;
if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}

// Export app for Vercel serverless deployment
module.exports = app;
