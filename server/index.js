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


dotenv.config()
const app = express();
const server = http.createServer(app);

const customDomain = 'recipe.ajithkumarr.com';
const deploymentUrl = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : `https://${customDomain}`;

// Updated Socket.io configuration with custom domain
export const io = new Server(server, {
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

// Express configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Improved CORS configuration
app.use(cors({
  origin: [
    'https://ajith-recipe-app.onrender.com',  // Allow your frontend's Render URL
    deploymentUrl,                            // Allow the current Vercel deployment
    'http://localhost:5173',                  // Local development URL
    'http://localhost:8080'                   // Local backend URL
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
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
  // Make cookies more secure
  res.setHeader('Set-Cookie', [
    'SameSite=None; Secure',
    'Path=/'
  ]);
  next();
});


app.options('*', (req, res) => {
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  // Respond with 200
  res.sendStatus(200);
});

// Special handling for Google auth endpoint
app.options('/api/auth/google', (req, res) => {
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  // Respond with 200
  res.sendStatus(200);
});

// API routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/notification', notifyRouter);
app.use('/api/chat', chatRouter);

// Static files
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

// Error handling middleware
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
  });
});

// MongoDB connection
const uri = process.env.mongodb_URL;
mongoose.connect(uri, { useNewUrlParser: true, connectTimeoutMS: 60000 })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Start server in dev mode
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => console.log(`The app is running at ${PORT}`));
}

// For Vercel, we need to export the Express app
export default app;