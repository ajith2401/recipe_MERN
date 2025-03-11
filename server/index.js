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

export const io = new Server(server, {
  cors:{
    origin: 'https://ajith-recipe-app.onrender.com',
    methods: ['GET', 'POST'],
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
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(cookieParser());

// API routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/notification', notifyRouter);
app.use('/api/chat', chatRouter);

// Static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// React routes
const reactPaths = ['/post/:postId', '/chat', '/profile/:userId','/chat/:friendId','/login','/updateprofile'];
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

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => console.log(`The app is running at ${PORT}`));
}

// Export for Vercel
export { app, server };