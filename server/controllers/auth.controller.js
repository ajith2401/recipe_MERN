import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js"
import jwt from 'jsonwebtoken'

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

export const signin = async (req, res, next) => {
  const { emailOrPhoneNumber, password } = req.body;
  try {
    const validUser = await User.findOne({ emailOrPhoneNumber });
    if (validUser === null) {
      return next(errorHandler(404, "user not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "invalid credentials"));
    }
    
    const token = jwt.sign({ id: validUser._id }, "1d50c142-cec3-45b5-b741-8701b4f233b0");
    const { password: pass, ...restVal } = validUser._doc;
    
    // Set SameSite and Secure attributes for production environments
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.ajithkumarr.com' : undefined,
      path: '/'
    };
    
    res.cookie("access_token", token, cookieOptions).json(restVal);
  } catch (error) {
    next(error);
  }
};


export const google = async (req, res, next) => {
  try {
    // Handle GET requests (typically from redirect)
    if (req.method === 'GET') {
      // You could either redirect to your frontend's OAuth handler
      return res.redirect('https://recipe.ajithkumarr.com/login?auth=google');
      
      // Or return a status message
      // return res.status(200).json({ message: "Please use POST request for Google authentication" });
    }
    
    // Rest of your existing POST handling logic
    const existingUser = await User.findOne({ emailOrPhoneNumber: req.body.emailOrPhoneNumber });
    if (existingUser) {
      // A user with the same email/phone number already exists, handle this case
      const token = jwt.sign({ id: existingUser._id }, "1d50c142-cec3-45b5-b741-8701b4f233b0");
      const { password, ...restVal } = existingUser._doc;
      
      // Set SameSite and Secure attributes for production environments
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.ajithkumarr.com' : undefined,
        path: '/'
      };
      
      res.cookie("access_token", token, cookieOptions).status(200).json(restVal);
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
      
      // Same cookie options as above
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.ajithkumarr.com' : undefined,
        path: '/'
      };
      
      res.cookie("access_token", token, cookieOptions).json(restVal);
    }
  } catch (error) {
    next(error);
  }
};



// Update your SignOutUser function as well:
export const SignOutUser = async (req, res, next) => {
  try {
    // Cookie options for clearing must match those used when setting
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.ajithkumarr.com' : undefined,
      path: '/'
    };
    
    res.clearCookie('access_token', cookieOptions);
    res.status(200).json({
      message: "user has been logged out"
    });
  } catch (error) {
    next(error);
  }
};
