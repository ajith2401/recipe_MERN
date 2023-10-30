import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        receiverId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        messageType: {
          type: String, // 'text', 'image', 'audio', 'video'
          required: true,
        },
        messageContent: {
          type: String, // Stores text or media URLs
        },
        reactions: [
          {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
            reaction: {
              type: String, // Store reaction type (e.g., 'like', 'love')
            },
          },
        ],
        status: {
          type: String, // 'sent', 'delivered', 'read'
          default: 'sent',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  }, { timestamps: true });

  const Chat = mongoose.model('chat',chatSchema)

  export default Chat
  