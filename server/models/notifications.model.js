import mongoose from "mongoose";


const NotificationSchema = new mongoose.Schema({
   recipientUserId :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
   } ,
   type: {
    type: String,},
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Post' 
    },
    senderUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isRead:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type: Date,
        default:Date.now,
    }
})
const Notification = mongoose.model("Notifications",NotificationSchema)
export default Notification