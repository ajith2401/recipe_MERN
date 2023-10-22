import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs"

export const test = (req,res) =>{
    res.json({
        message: "hello world"
    });
}

export const updateUser =async (req,res,next) =>{
    if(req.user.id !== req.params.id) return next(errorHandler(403,"forbiden"))
    try {
    if(req.body.password){
        req.body.password = bcryptjs.hashSync(req.body.password,10)
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailOrPhoneNumber: req.body.emailOrPhoneNumber,
            password: req.body.password,
            avatar: req.body.avatar
        }
    }, { new: true });
    const {password, ...rest} = updateUser._doc

    res.status(200).json(rest);     
        } catch (error) {
            next(error)   
        }

}