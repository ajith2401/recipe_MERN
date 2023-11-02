import Chat from "../models/chat.model.js";
import { errorHandler } from "../utils/error.js";
import { io } from "../index.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { senderId } = req.params;
    const { receiverId, messageType, messageContent } = req.body;

    // Check if a chat exists between the sender and receiver
    const existingChat = await Chat.findOne({
      senderId: senderId,
      receiverId: receiverId,
    });

    // Prepare the message object
    const messageObj = {
      senderId: senderId,
      receiverId: receiverId,
      messageType: messageType,
      messageContent: messageContent,
      reactions: [],
    };

    io.emit('message', messageObj);

    if (existingChat) {
      // If the chat exists, add the message to the existing chat
      existingChat.messages.push(messageObj);
      await existingChat.save();
      // res.status(200).json(existingChat);
    } else {
      // If the chat doesn't exist, create a new chat with the message
      const newChat = new Chat({
        messages: [messageObj],
        senderId: senderId,
        receiverId: receiverId,
      });
      await newChat.save();
      // res.status(201).json(newChat);
    }

    const chat1 = await Chat.findOne({
      $or: [
        { senderId, receiverId }
      ],
    });

    const chat2 = await Chat.findOne({
      $or: [
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (!chat1) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Combine messages and sort them by timestamp (ascending) to get a chronological chat history
    const combinedMessages = [...chat1.messages, ...chat2.messages];
    combinedMessages.sort((a, b) => a.timestamp - b.timestamp);

    res.status(200).json(combinedMessages);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getChatHistory = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.params;

    // Find the chat between sender and receiver
    const chat1 = await Chat.findOne({
      $or: [
        { senderId, receiverId },
      ],
    });

    const chat2 = await Chat.findOne({
      $or: [
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (!chat1) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Combine messages and sort them by timestamp (ascending) to get a chronological chat history
    const combinedMessages = [...chat1.messages, ...chat2.messages];
    combinedMessages.sort((a, b) => a.timestamp - b.timestamp);

    res.status(200).json(combinedMessages);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const sendMessageOrGetChatHistory = async (req, res, next) => {
  try {
    const { senderId } = req.params;
    const { receiverId, messageType, messageContent } = req.body;

    if (messageContent) {
      // This is a message send operation
      // Check if a chat exists between the sender and receiver
      const existingChat = await Chat.findOne({
        senderId: senderId,
        receiverId: receiverId,
      });

      // Prepare the message object
      const messageObj = {
        senderId: senderId,
        receiverId: receiverId,
        messageType: messageType,
        messageContent: messageContent,
        reactions: [],
      };

      if (existingChat) {
        // If the chat exists, add the message to the existing chat
        existingChat.messages.push(messageObj);
        await existingChat.save();
        res.status(200).json(existingChat);
      } else {
        // If the chat doesn't exist, create a new chat with the message
        const newChat = new Chat({
          messages: [messageObj],
          senderId: senderId,
          receiverId: receiverId,
        });
        await newChat.save();
        res.status(201).json(newChat);
      }
    } else {
      // This is a chat history retrieval operation
      const chat1 = await Chat.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });

      const chat2 = await Chat.findOne({
        $or: [
          { senderId: receiverId, receiverId: senderId },
        ],
      });

      if (!chat1) {
        return res.status(404).json({ message: 'Chat not found' });
      }

      // Combine messages and sort them by timestamp (ascending) to get a chronological chat history
      const combinedMessages = [...chat1.messages, ...chat2.messages];
      combinedMessages.sort((a, b) => a.timestamp - b.timestamp);

      res.status(200).json(combinedMessages);
    }
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};




// Controller to get the list of chatted users for a given userID
export const getChattedUsers = async (req, res, next) => {
  try {
    const { senderId } = req.params;
    const userChats = await Chat.find({
      $or: [
        { senderId: senderId },
        { receiverId: senderId },
      ],
    }).select('senderId receiverId');

    // Create a set to store unique user IDs
    const chattedUserIds = new Set();

    // Iterate through the userChats and add senderId and receiverId to the set
    userChats.forEach((chat) => {
      chattedUserIds.add(chat.senderId.toString());
      chattedUserIds.add(chat.receiverId.toString());
    });

    // Convert the set to an array
    const chattedUsers = Array.from(chattedUserIds);

    res.status(200).json(chattedUsers);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};



  
