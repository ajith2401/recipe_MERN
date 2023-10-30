import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Store connected clients (users) in a Map
const connectedClients = new Map();

io.on('connection', (socket) => {
  // Handle new connections
  console.log('A user connected with socket id:', socket.id);

  socket.on('join', (userId) => {
    // Store the socket associated with the user
    connectedClients.set(userId, socket);
  });

  socket.on('disconnect', () => {
    // Handle disconnections
    console.log('A user disconnected with socket id:', socket.id);

    // Remove the user from the connectedClients Map
    for (const [userId, userSocket] of connectedClients) {
      if (userSocket === socket) {
        connectedClients.delete(userId);
        break;
      }
    }
  });
});

// API endpoint to send a notification
app.post('/api/notify/:userId', (req, res) => {
  const { userId } = req.params;
  const { message } = req.body;

  const userSocket = connectedClients.get(userId);
  if (userSocket) {
    userSocket.emit('notification', message);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'User not found or not connected' });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


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


const chatHistory = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/chat/history/${senderId}/${receiverId}`, {
      method: 'GET',
      credentials: 'include',  
    });
    if (!response.ok) {
      console.error('Error response:', await response.text());
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
    const data = await response.json();
    // Update the messages state with the new message
    setMessages([ ...data]);
    console.log('Response data from History:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};
