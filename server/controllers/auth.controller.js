import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js"
import jwt from 'jsonwebtoken'

export const signup = async (req,res,next) =>{
   const {firstName,lastName,password,emailOrPhoneNumber} = req.body
   const hashedPassword = bcryptjs.hashSync(password,10)
   const newUser = new User ({firstName,lastName,password:hashedPassword,emailOrPhoneNumber})
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
        res.cookie("access_token", token , {httpOnly: true }).status(200).json(restVal)
    } catch (error) {
     next(error)      
    }
}