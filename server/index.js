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
const server = http.createServer(app)
export const io = new Server(server,{
  cors:{
    origin: 'https://ajith-recipe-app.onrender.com', // Allow connections from your frontend app
    methods: ['GET', 'POST'],
  }
})

const connectedClients = new Map()
const PORT = process.env.PORT || 8080;
const uri = process.env.mongodb_URL ;
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.resolve();
console.log("__filename",__filename)


io.on('connection',(socket)=>{
  console.log("a user is connected with socket id",socket.id)
  socket.on('join', (userId) => {
    console.log(`User with ID ${userId} joined.`);
    connectedClients.set(userId, socket);
    // You can store userId or associate it with the socket here for further use.
  });
  socket.on('disconnect',()=>{
   console.log( "a user is disconnected", socket.id)

   for (const[userId ,userSocket] of connectedClients){
    if (userSocket===socket){
      connectedClients.delete(userId)
      break;
    }
   }

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
        receiverUserId:message.receiverId
      }]);
    }
  });
  
  })
})

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.static(path.join(__dirname, '/client/dist')));


const reactPaths = ['/post/:postId', '/chat', '/profile/:userId','/chat/:friendId','/profile/:userId','/login','/updateprofile'];

// Create a single route handler to serve these paths
app.get(reactPaths, (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


app.use(cors({
  origin: 'https://ajith-recipe-app.onrender.com', // Replace with your front-end origin
  credentials: true, // Allow cookies to be sent with requests
}));

app.use(cookieParser());

mongoose.connect(uri, { useNewUrlParser: true, connectTimeoutMS: 60000 })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

server.listen(PORT, () => console.log(`The app is running at ${PORT}`));

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/notification', notifyRouter);
app.use('/api/chat', chatRouter );

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
  });
});
