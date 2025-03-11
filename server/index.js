import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/user.router.js";
import authRouter from "./routes/auth.router.js";
import cookieParser from "cookie-parser";
import postRouter from "./routes/post.router.js"
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
import { Server } from "socket.io";
import http from 'http'
import notifyRouter from "./routes/notify.router.js";
import chatRouter from "./routes/chat.router.js";

dotenv.config();
const app = express();

// For local development
const isProduction = process.env.NODE_ENV === 'production';
const server = isProduction ? null : http.createServer(app);

// Get deployment URL
const customDomain = 'recipe.ajithkumarr.com';
const deploymentUrl = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : `https://${customDomain}`;

// Socket.io only for development
// In production (Vercel), we'll use a different approach
if (!isProduction && server) {
  // Updated Socket.io configuration with custom domain
  const io = new Server(server, {
    cors:{
      origin: [
        'https://ajith-recipe-app.onrender.com',
        `https://${customDomain}`,
        deploymentUrl,
        'http://localhost:5173',
        'http://localhost:8080'
      ],
      methods: ['GET', 'POST', 'OPTIONS'],
      credentials: true
    }
  });

  // Socket.io connection logic
  const connectedClients = new Map();
  io.on('connection', (socket) => {
    console.log("a user is connected with socket id", socket.id);
    socket.on('join', (userId) => {
      console.log(`User with ID ${userId} joined.`);
      connectedClients.set(userId, socket);
    });
    
    socket.on('disconnect', () => {
      console.log("a user is disconnected", socket.id);
      for (const[userId, userSocket] of connectedClients) {
        if (userSocket === socket) {
          connectedClients.delete(userId);
          break;
        }
      }
    });
    
    socket.on('like', (notification) => {
      const recipientSocket = connectedClients.get(notification.recipientUserId);
      if (recipientSocket) {
        recipientSocket.emit('notification', [{
          type: notification.type,
          postId: notification.postId,
          senderUserId: notification.senderUserId,
        }]);
      }
    });
    
    socket.on('message', (message) => {
      const recipientSocket = connectedClients.get(message.receiverId);
      if (recipientSocket) {
        recipientSocket.emit('messageReceived', [{
          type: message.messageType,
          messageContent: message.messageContent,
          senderUserId: message.senderUserId,
          receiverUserId: message.receiverId
        }]);
      }
    });
  });

  // Export io for modules that need it
  app.set('io', io);
}

// Express configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Improved CORS configuration
const allowedOrigins = [
  'https://ajith-recipe-app.onrender.com',
  deploymentUrl,
  'http://localhost:5173',
  'http://localhost:8080'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, true); // Just allow all origins in development
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(cookieParser());

// Add security headers
app.use((req, res, next) => {
  // Fix COOP warnings by allowing popups
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  // Standard security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// API routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/notification', notifyRouter);
app.use('/api/chat', chatRouter);

// Health check for Vercel
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Static files for non-Vercel environments
if (!isProduction) {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // React routes
  const reactPaths = ['/', '/post/:postId', '/chat', '/profile/:userId','/chat/:friendId','/login','/updateprofile'];
  app.get(reactPaths, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
  
  // Catch-all route
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";
  console.error(error);
  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const uri = process.env.mongodb_URL;
    if (!uri) {
      throw new Error('MongoDB connection string is missing');
    }
    
    await mongoose.connect(uri, { 
      useNewUrlParser: true, 
      connectTimeoutMS: 60000 
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

// Start server in dev mode
if (!isProduction && server) {
  const PORT = process.env.PORT || 8080;
  connectDB().then(() => {
    server.listen(PORT, () => console.log(`The app is running at ${PORT}`));
  });
} else {
  // For Vercel, we connect to MongoDB but don't start a server
  connectDB();
}

// For Vercel, we need to export the Express app
export default app;