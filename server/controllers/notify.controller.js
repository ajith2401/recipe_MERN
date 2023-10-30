import Notification from "../models/notifications.model.js";
import { errorHandler } from "../utils/error.js";


export const getNotification =async(req,res,next)=>{
    try {
        const {recipientUserId} = req.params;
        const recipientUserNotifications = await Notification.find({recipientUserId : recipientUserId})
        res.status(200).json(recipientUserNotifications)
        
    } catch (error) {
        next(errorHandler(404,error.message))     
    } 
}