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
import { connect } from "http2";
import notifyRouter from "./routes/notify.router.js"
// import morgan from "morgan";
// import helmet from "helmet";
// import multer from "multer";
// import { copyFile } from "fs";

dotenv.config()
const app = express();
const server = http.createServer(app)
export const io = new Server(server,{
  cors:{
    origin: 'http://localhost:3000', // Allow connections from your frontend app
    methods: ['GET', 'POST'],
  }
})

const connectedClients = new Map()
const PORT = process.env.PORT || 8080;
const uri = process.env.mongodb_URL ;
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
console.log("__filename",__filename)

// app.use(helmet())
// app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
// app.use(morgan("common"))
// app.use("/assets",express.static(path.join(__dirname,"public/assets")))
// const storage = multer.diskStorage({
//   destination:function(req,file,cb) {
//    cb(null,"public/assets")
//   },
//   filename: function(req,file,cb){
//     cb(null, file.originalname)
//   }
// })
//  

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
  
  })
})

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your front-end origin
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
app.use('/api/notification',notifyRouter)
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
  });
});

