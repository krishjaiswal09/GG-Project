import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from '../config/db.js';
import config from '../config/config.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import 'dotenv/config';

// Connect to MongoDB
connectDB();

const app = express();

// Dynamic origins for CORS to support both local and production environments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173', // Vite preview
  'https://yourtaskapp.vercel.app', // Replace with your frontend URL
  'https://frontend-g1l73yh8g-krish-jaiswals-projects.vercel.app', // New Vercel frontend URL
  // Add any other origins as needed
];

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || 
        process.env.NODE_ENV === 'development' || 
        origin.endsWith('vercel.app')) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// API Routes with proper prefixes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Add API status endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Enhanced error handler middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`Error: ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    timestamp: new Date().toISOString()
  });
});

const PORT = config.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Gracefully shut down the server
  server.close(() => process.exit(1));
});