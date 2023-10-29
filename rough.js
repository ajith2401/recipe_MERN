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
