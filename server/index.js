  import express from "express";
  import cors from "cors";
  import bodyParser from "body-parser";
  import mongoose from "mongoose";
  import userRouter from "./routes/user.router.js";
  
  const app = express();
  const PORT = process.env.PORT || 8080;
  
  app.use(bodyParser.json({ limit: "30mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
  app.use(cors());

  const uri = "mongodb+srv://ajith24ram:Ajith24rAm@jsmastry.dkhyzzl.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
  mongoose.connect(uri)
  .then(()=>console.log("connected mongoDB"))
  .catch((err)=>console.log(err))

app.listen(PORT,()=> console.log(`the app is running at  ${PORT}`))

app.use('/api/user',userRouter)