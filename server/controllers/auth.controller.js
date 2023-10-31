import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

// Load environment variables from a .env file (this is optional in a production environment)
dotenv.config();

// Now, you can access your environment variable
const jwtSecret = process.env.JWT_SECRET;

export const signup = async (req,res,next) =>{
   const {firstName,lastName,password,emailOrPhoneNumber} = req.body
   const hashedPassword = bcryptjs.hashSync(password,10)
   const newUser = new User({firstName,lastName,password:hashedPassword,emailOrPhoneNumber})
   try{
    await newUser.save()
    res.status(201).json("user created successfully!!")
   }
   catch(error){
    next(error)
   }   
} 

export const signin = async (req,res,next)=>{
    const {emailOrPhoneNumber, password } = req.body
    try {
        const validUser = await User.findOne({emailOrPhoneNumber})
        if (validUser === null) {
            return next(errorHandler(404, "user not found"));
          }
          const validPassword = bcryptjs.compareSync(password, validUser.password);
          if (!validPassword) {
            return next(errorHandler(401, "invalid credentials"));
          }          
        const token = jwt.sign({id : validUser._id}, "1d50c142-cec3-45b5-b741-8701b4f233b0")
        const { password: pass, ...restVal } = validUser._doc;
        res.cookie("access_token", token, { httpOnly: true, domain: "https://ajith-recipe-app.onrender.com" }).json(restVal)
    } catch (error) {
     next(error)      
    }
}


export const google = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ emailOrPhoneNumber: req.body.emailOrPhoneNumber });
    if (existingUser) {
      // A user with the same email/phone number already exists, handle this case
      const token = jwt.sign({ id: existingUser._id }, "1d50c142-cec3-45b5-b741-8701b4f233b0");
      const { password, ...restVal } = existingUser._doc;
      res.cookie("access_token", token, { httpOnly: true }).status(200).json(restVal);
    } else {
      // No user found, create a new user
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        firstName: req.body.firstName,
        password: hashedPassword,
        emailOrPhoneNumber: req.body.emailOrPhoneNumber,
        avatar: req.body.avatar,
        location: "",
        occupation: "",
        twitter: "",
        linkedIn: "",
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, "1d50c142-cec3-45b5-b741-8701b4f233b0");
      const { password, ...restVal } = newUser._doc;
      res.cookie("access_token", token, { httpOnly: true, domain: "https://ajith-recipe-app.onrender.com" }).json(restVal)
    }
  } catch (error) {
    next(error);
  }
};

export const SignOutUser = async (req,res,next) => {
 try {
 res.clearCookie('access_token')
  res.status(200).json({
      message:"user has been logged out"
  })
 }catch (error) {
  next(error)
 }
}
