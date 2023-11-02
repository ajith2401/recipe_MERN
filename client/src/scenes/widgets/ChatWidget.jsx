import { useEffect, useRef, useState } from 'react';
import {
  Typography,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Fab,
  ListItemIcon,
  Avatar,
  useMediaQuery,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import UserImage from '../../components/UserImage';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

const ChatWidget = ({receiverId}) => {
  const [messages, setMessages] = useState([]);
  const navigateTo = useNavigate()
  const [messageContent, setmessageContent] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const senderId = currentUser._id;
  const [receiver, setReciver] = useState(null);
  const theme = useTheme();
  const [chattedUsersData,setChattedUsersData] = useState([]);
  const isNonMobileScreens = useMediaQuery(theme.breakpoints.up('md'));
  const [formData, setFormData] = useState({
    senderId: senderId,
    receiverId: receiverId,
    messageType: 'text',
    messageContent: '', // Initialize with an empty string
    reactions: [],
    status: 'sent',
  });
  const socket = io('https://ajith-recipe-app.onrender.com', {
    reconnection: true, // Enable reconnection attempts
    reconnectionAttempts: 5, // Maximum number of reconnection attempts
    reconnectionDelay: 1000, // Delay between reconnection attempts (in milliseconds)
  });
  const getUser = async () => {
    const response = await fetch(`/api/user/${receiverId}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    setReciver(data);
  };
  getUser()

  const getChattedUsers = async () => {
    const response = await fetch(`/api/chat/chattedusers/${senderId}`, {
      method: 'GET',
      credentials: 'include',
    });
    const listOfChattedUsers = []
  
    if (response.status === 200) {
      const data = await response.json();
      console.log('Chatted users id', data);
      // Loop through the user IDs and fetch user data for each user
      for (const userId of data) {
        const userResponse = await fetch(`/api/user/${userId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (userResponse.status === 200) {
          const userData = await userResponse.json();
          listOfChattedUsers.push(userData);
          setChattedUsersData([...listOfChattedUsers])
        } else {
          console.error(`Failed to fetch user data for user ID: ${userId}`);
        }
      }
  
      console.log('User data for chatted users', chattedUsersData);
    } else {
      console.error('Failed to fetch chatted users');
    }
  };

  const handleSendMessage = async () => {
    try {
      if (!formData.receiverId) {
        console.error('Receiver is not specified.');
        return;
      }
  
      const response = await fetch(`/api/chat/${senderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData), // Use formData to send the message
      });
      
  
      if (!response.ok) {
        console.error('Error response:', await response.text());
        throw new Error(`Failed to send message: ${response.statusText}`);
      }
  
      const data = await response.json();
      setMessages([...data]);
      setmessageContent('');  
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const ChatHistory = async (sendingId,receivingId) => {
    try {
      const response = await fetch(`/api/chat/history/${sendingId}/${receivingId}`, {
        method: 'GET',
        credentials: 'include',
        // Use formData to send the message
      });
      
  
      if (!response.ok) {
        console.error('Error response:', await response.text());
        throw new Error(`Failed to send message: ${response.statusText}`);
      }
  
      const data = await response.json();
      setMessages([...data]);
      setmessageContent('');  
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const messagesContainerRef = useRef();
 
  useEffect(()=>{
    getChattedUsers();
    handleSendMessage()
    socket.connect();
    const userId = senderId;
    socket.emit('join',userId)
    socket.on("message", (message) => {
      setMessages((prevNotifications) => [...prevNotifications, message]);
      setmessageContent('');  
    });
    return ()=>{
      socket.disconnect()
    }
  },[])

  function formatTime(timeString) {
    const date = new Date(timeString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    if (isSameDay(date, today)) {
      return formatDateToTime(date);
    } else if (isSameDay(date, yesterday)) {
      return "Yesterday " + formatDateToTime(date);
    } else {
      return formatDateToCustomFormat(date);
    }
  }
  
  function isSameDay(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }
  
  function formatDateToTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  }
  
  function formatDateToCustomFormat(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const time = formatDateToTime(date);
  
    return `${day}-${month}-${year} ${time}`;
  }
  

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  },[messages]); 
  
  const handleTextChange = (e) => {
    const newMessageContent = e.target.value;
    setmessageContent(newMessageContent);
    // Update formData with the new messageContent
    setFormData({
      ...formData,
      messageContent: newMessageContent,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents a newline character from being added
      handleSendMessage();
    }
  };

  const handleSendButton = (e) => {
      e.preventDefault(); // Prevents a newline character from being added
      handleSendMessage();
 
  };
  

  return (
    <div>
    <Grid>
    <Typography variant='h3'>chat</Typography>
    </Grid>
    <Grid container variant={Paper}>
        {isNonMobileScreens && <Grid item xs={3}>
            <List>
                <ListItem button key={receiverId}>
                    <ListItemIcon>
                    <Avatar alt="user image" src={receiver?.avatar} />
                    </ListItemIcon>
                    <ListItemText primary={`${receiver?.firstName} ${receiver?.lastName ?receiver.lastName  : "" }`}></ListItemText>
                </ListItem>
            </List>
            <Divider />
            <Grid item xs={12} style={{padding: '10px'}}>
                <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
            </Grid>
           
            <List>
            <Divider/>
            {chattedUsersData.map((chatUser, index) => (
              <ListItem button key={index}  onClick={() => {
                        navigateTo(`/chat/${chatUser._id}`);
                        ChatHistory(senderId, chatUser._id);
                      }}
                   >
                <ListItemIcon>
                  <UserImage image={chatUser.avatar} size="50px" />
                </ListItemIcon>
                <ListItemText
                  primary={chatUser.firstName ? chatUser.firstName :"" + chatUser.lastName ? chatUser.lastName :""} />
                <ListItemText secondary="online" align="right" />
              </ListItem>
            ))}

            </List>
            </Grid>
          }
            
          {isNonMobileScreens && <Grid item xs={9}>        
              <List xs={6} style={{ height: '75vh', overflow: 'auto' ,justifyContent:"center",padding:"0 70px 0 70px"}} variant={Paper} ref={messagesContainerRef}>
              {messages.flat().map((msg, index) => (
                  msg.messageContent ?   
                  <ListItem key={index} >
                  {msg.senderId === senderId ? (

                    <Grid container justifyContent="flex-end">
                    <Grid item xs={3} display={'flex'} flexDirection={'row'} gap={"1rem"}>
                      <ListItemText 
                      align={"right"}
                          primary={msg.messageContent}
                          secondary={ formatTime(msg.timestamp) }        
                          sx={{  
                              background: 'linear-gradient(to bottom right, rgba(252, 203, 144, 1), rgba(213, 126, 235, 1))',
                              borderRadius:"10px",
                              padding:"5px",
                              
                          }}
                          
                      />
                      <UserImage image={currentUser.avatar} size="50px" />
                      </Grid>
                      </Grid>
                      ) : (
                        <Grid container justifyContent="flex-start">
                        <Grid item xs={3} display={'flex'} flexDirection={'row'} gap={"1rem"}>
                        <UserImage image={receiver.avatar} size="50px" />
                          <ListItemText 
                          primary={msg.messageContent}
                          secondary={  formatTime(msg.timestamp) }   
                          align="left"
                          sx={{  
                              background: 'linear-gradient(to bottom right, rgba(252, 203, 144, 1), rgba(213, 126, 235, 1))',
                              borderRadius:"10px",
                              padding:"5px",
                              
                          }}
                        
                        />
                        </Grid>
                        </Grid>
                      )
                      } 
                  </ListItem> : null
              ))}
              </List>  
        <Divider />
        <Grid container style={{padding: '20px'}}>
            <Grid item xs={11}>
            <TextField
            id="outlined-basic-email"
            fullWidth
            label="Type your message..."
            variant="outlined"
            name="messageContent"
            value={messageContent}
            onChange={handleTextChange}
            onKeyDown={handleKeyPress}
          />
            </Grid>
            <Grid xs={1} align="right">
                <Fab color="primary" aria-label="add"><Send /></Fab>
            </Grid>
        </Grid> 
      </Grid>}

       {!isNonMobileScreens && <Grid item xs={12}>
          <List
            style={{
              height: '75vh',
              overflow: 'auto',
              justifyContent: 'center',
              padding: isNonMobileScreens ? '0 70px' : '0',
            }}
            variant={Paper}
            ref={messagesContainerRef}
          >
          {messages.flat().map((msg, index) => (
            msg.messageContent ?   
            <ListItem key={index} >
            {msg.senderId === senderId ? (

              <Grid container justifyContent="flex-end">
              <Grid item xs={6} display={'flex'} flexDirection={'row'} gap={"1rem"}>
                <ListItemText 
                align={"right"}
                    primary={msg.messageContent}
                    secondary={ formatTime(msg.timestamp) }        
                    sx={{  
                        background: 'linear-gradient(to bottom right, rgba(252, 203, 144, 1), rgba(213, 126, 235, 1))',
                        borderRadius:"10px",
                        padding:"5px",
                        
                    }}
                    
                />
                <UserImage image={currentUser.avatar} size="30px" />
                </Grid>
                </Grid>
                ) : (
                  <Grid container justifyContent="flex-start">
                  <Grid item xs={6} display={'flex'} flexDirection={'row'} gap={"1rem"}>
                  <UserImage image={receiver.avatar} size="30px" />
                    <ListItemText 
                    primary={msg.messageContent}
                    secondary={  formatTime(msg.timestamp) }   
                    align="left"
                    sx={{  
                        
                        background: 'linear-gradient(to bottom right, rgba(252, 203, 144, 1), rgba(213, 126, 235, 1))',
                        borderRadius:"10px",
                        padding:"5px",
                        
                    }}
                  
                  />
                  </Grid>
                  </Grid>
                )
                } 
            </ListItem> : null
        ))}
          </List>
          <Divider />
          <Grid container style={{ padding: '20px' }}>
            <Grid item xs={11}>
              <TextField
                id="outlined-basic-email"
                fullWidth
                label="Type your message..."
                variant="outlined"
                name="messageContent"
                value={messageContent}
                onChange={handleTextChange}
              />
            </Grid>
            <Grid xs={1} align="right">
              <Fab color="primary" aria-label="add" onClick={handleSendButton}>
                <Send />
              </Fab>
            </Grid>
          </Grid>
        </Grid> }
    </Grid> 
    </div>
    
  );
};

ChatWidget.propTypes = {
  receiverId: PropTypes.string.isRequired, // Use the appropriate prop type (string, number, etc.)
};
export default ChatWidget;
