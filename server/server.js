const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static frontend files (built from client)
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Health check route - does NOT require DB
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.VERCEL ? 'vercel' : 'local'
  });
});

// Database connection helper with fast timeout
let isConnecting = false;
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  if (isConnecting) return false;

  const uri = process.env.MONGO_URI || (process.env.VERCEL ? null : 'mongodb://127.0.0.1:27017/student_planner');
  if (!uri) {
    console.warn('MONGO_URI is not set.');
    return false;
  }

  isConnecting = true;
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log('MongoDB connected successfully');
    isConnecting = false;
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    isConnecting = false;
    return false;
  }
};

// Middleware to check DB connection for API routes only
app.use(async (req, res, next) => {
  // Only check DB for /api/ routes (except health)
  if (!req.path.startsWith('/api') || req.path === '/api/health') {
    return next();
  }

  // Attempt connection if not connected
  if (mongoose.connection.readyState !== 1) {
    const connected = await connectDB();
    if (!connected) {
      return res.status(503).json({
        message: process.env.VERCEL
          ? 'Database not connected. Please set MONGO_URI in your Vercel project environment variables (using MongoDB Atlas).'
          : 'Could not connect to local MongoDB. Please make sure MongoDB is running on port 27017.'
      });
    }
  }

  next();
});

// API Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Fallback all non-API routes to index.html (SPA client routing)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  }
  res.status(404).json({ message: 'API route not found' });
});

// For local development
const PORT = process.env.PORT || 5001;
if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}

module.exports = app;
