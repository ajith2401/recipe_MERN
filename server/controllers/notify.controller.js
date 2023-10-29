import Notification from "../models/notifications.model.js";
import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const getNotification =async(req,res,next)=>{
    try {
        const {recipientUserId} = req.params;
        const recipientUserNotifications = await Notification.find({recipientUserId : recipientUserId})
        res.status(200).json(recipientUserNotifications)
        
    } catch (error) {
        next(errorHandler(404,error.message))     
    } 
}