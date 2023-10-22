import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/user.router.js";
import authRouter from "./routes/auth.router.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Configure CORS using the cors middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true, // Allow cookies to be sent with requests
}));

app.use(cookieParser());

const uri = "mongodb+srv://ajith24ram:Ajith24rAm@jsmastry.dkhyzzl.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`The app is running at ${PORT}`));

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
  });
});

 