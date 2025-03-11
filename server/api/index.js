// server/api/index.js - Optimized for Vercel serverless functions
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import userRouter from '../routes/user.router.js';
import authRouter from '../routes/auth.router.js';
import postRouter from '../routes/post.router.js';
import notifyRouter from '../routes/notify.router.js';
import chatRouter from '../routes/chat.router.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express app for serverless
const app = express();

// Define domains for CORS
const customDomain = 'recipe.ajithkumarr.com';
const deploymentUrl = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : `https://${customDomain}`;

const allowedOrigins = [
  'https://ajith-recipe-app.onrender.com',
  `https://${customDomain}`,
  deploymentUrl,
  'http://localhost:5173',
  'http://localhost:8080'
];

// Configure middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes(customDomain)) {
      callback(null, true);
    } else {
      // Allow all origins in development for easier debugging
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Temporarily allow all origins while debugging
      }
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  next();
});

// Security and CORS headers
app.use((req, res, next) => {
  // Fix COOP warnings by allowing popups
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  // Standard security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  
  next();
});

// Handle preflight OPTIONS requests
app.options('*', (req, res) => {
  res.sendStatus(204);
});

// Special handler for Google Auth
app.options('/api/auth/google', (req, res) => {
  console.log('OPTIONS request to /api/auth/google');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.sendStatus(204);
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.status(200).json({
    message: "API is working",
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_URL: process.env.VERCEL_URL
    }
  });
});

// API routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/notification', notifyRouter);
app.use('/api/chat', chatRouter);

// Catch-all for API routes not found
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    url: req.url,
    method: req.method
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
  });
});

export default app;