import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDatabase from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import candidateAuthRoutes from './routes/candidateAuthRoutes.js';
import recruiterAuthRoutes from './routes/recruiterAuthRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import errorHandler from './middleware/errorHandler.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// Validate critical environment variables
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env file');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not defined in .env file');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully');
console.log('📌 MongoDB URI configured:', process.env.MONGODB_URI?.substring(0, 20) + '...');

// Create Express app
const app = express();

// Middleware
// CORS: allow both localhost (dev) and production Vercel URL
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, server-to-server, mobile)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.method !== 'GET' ? req.body : undefined,
    query: Object.keys(req.query).length ? req.query : undefined,
  });
  next();
});

// Health check route - works without database
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    success: true,
    message: 'Server is running',
    database: {
      status: dbStates[dbStatus],
      ready: dbStatus === 1,
    },
    timestamp: new Date().toISOString(),
  });
});

// Middleware to check database connection before processing requests
const requireDatabase = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is not connected. Please try again later.',
      error: 'Service temporarily unavailable',
    });
  }
  next();
};

// Apply database check to all API routes (except health check)
app.use('/api/auth', requireDatabase, authRoutes);
app.use('/api/auth/candidate', requireDatabase, candidateAuthRoutes);
app.use('/api/auth/recruiter', requireDatabase, recruiterAuthRoutes);
app.use('/api/resume', requireDatabase, resumeRoutes);
app.use('/api/jobs', requireDatabase, jobRoutes);


// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server function
const startServer = async () => {
  try {
    // Connect to database first
    console.log('\n🔄 Step 1: Connecting to MongoDB...');
    await connectDatabase();

    // Verify connection is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection not ready after connect attempt');
    }

    console.log('✅ Step 1: MongoDB connection verified (readyState = 1)');

    // Start Express server only after database is connected
    console.log('\n🔄 Step 2: Starting Express server...');
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   🚀 Server running on port ${PORT}      ║
║   📝 Environment: ${process.env.NODE_ENV || 'development'}        ║
║   🌐 Frontend: ${process.env.FRONTEND_URL}   ║
║   💾 Database: Connected ✅              ║
╚════════════════════════════════════════╝
      `);
      console.log('✅ Step 2: Express server started successfully');
      console.log('\n🎉 Backend is ready to accept requests!\n');
    });
  } catch (error) {
    console.error('\n❌ CRITICAL: Failed to start server');
    console.error('Error:', error.message);
    console.error('\n📋 Startup failed because:');
    console.error('   - MongoDB connection could not be established');
    console.error('   - Server will not start without database connection');
    console.error('\n💡 To fix this issue:');
    console.error('   1. Check your MongoDB Atlas connection string');
    console.error('   2. Verify Network Access settings (IP whitelist)');
    console.error('   3. Ensure cluster is not paused');
    console.error('   4. Try using standard connection string (not SRV)');
    console.error('\n📖 See: backend/QUICK_FIX.md for detailed solutions\n');
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  console.error('Shutting down server...');
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  console.error('Shutting down server...');
  process.exit(1);
});

// Start the server
startServer();
