import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs"

export const test = (req,res) =>{
    res.json({
        message: "hello world"
    });
}

export const updateUser =async (req,res,next) =>{
    if (req.user.id !== req.params.id) return next(errorHandler(401,"you can only update your own account"))
    try {
    if(req.body.password){
        req.body.password = bcryptjs.hashSync(req.body.password,10)
    }
    const updateUserDetails = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailOrPhoneNumber: req.body.emailOrPhoneNumber,
            password: req.body.password,
            avatar: req.body.avatar
        }
    }, { new: true });
    const {password, ...rest} = updateUserDetails._doc

    res.status(200).json(rest);     
        } catch (error) {
            next(error)   
        }

}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only delete your own account."));
    }  
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("access_token");
        res.status(200).json({
            message: "Account deleted successfully"
        });
    } catch (error) {
        next(errorHandler(500, "Error deleting the account."));
    }
};
