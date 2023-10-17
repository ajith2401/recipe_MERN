  import express from "express";
  import cors from "cors";
  import bodyParser from "body-parser";
  import mongoose from "mongoose";
  import userRouter from "./routes/user.router.js";
  import authRouter from "./routes/auth.router.js"
  
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
app.use('/api/auth',authRouter)

app.use((error,req,res,next)=>{
    const statusCode = error.statusCode || "500"
    const message = error.message || "internal server error"

    return res.status(statusCode).json({
        success : false,
        statusCode : statusCode,
        message:message 
    })
})