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
import morgan from "morgan";
import helmet from "helmet";
import multer from "multer";
import { copyFile } from "fs";

dotenv.config()
const app = express();
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
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
const allowedOrigins = [
  "https://recipe-mern-gg7slvvg5-ajith2401.vercel.app",
  "http://localhost:3000", // Add more allowed origins here
];
// Configure CORS using the cors middleware
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies to be sent with requests
}));

app.use(cookieParser());


mongoose.connect(uri, { useNewUrlParser: true, connectTimeoutMS: 30000 })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`The app is running at ${PORT}`));

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
  });
});

