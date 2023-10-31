
import React, { useEffect, useRef, useState } from 'react';

import {
    Typography,
    TextField,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Grid,
    Fab,
    Avatar,
  } from '@mui/material';

import { Add, Send } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const Chat = ({receiverId}) => {
    const [messages, setMessages] = useState([]);
    const [messageContent, setmessageContent] = useState('');
    const { currentUser } = useSelector((state) => state.user);
    const senderId = currentUser._id;
    const [formData, setFormData] = useState({
              senderId: senderId,
              receiverId: receiverId,
              messageType: 'text',
              messageContent: messageContent,
              reactions: [],
              status: 'sent',
      
    });
    const chatHistory = async () => {
      try {
        const response = await fetch(`https://ajith-recipe-app.onrender.com/api/chat/history/${senderId}/${receiverId}`, {
          method: 'GET',
          credentials: 'include',  
        });
        if (!response.ok) {
          console.error('Error response:', await response.text());
          throw new Error(`Failed to send message: ${response.statusText}`);
        }
        const data = await response.json();
        setMessages([...messages ,...data])
        console.log('Response data from History:', data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    const handleSendMessage = async () => {
      try {
        if (!formData.receiverId) {
          console.error('Receiver is not specified.');
          return;
        }
    
        const response = await fetch(`https://ajith-recipe-app.onrender.com/api/chat/${senderId}`, {
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
      //   setMessages([...messages ,...data])
        console.log('Response data from History:', data);
        setmessageContent('');  
      } catch (error) {
        console.error('Error:', error);
      }
    };
    const messagesContainerRef = useRef();
    useEffect(() => {
      chatHistory()
      // handleSendMessage();
    }, []);
    useEffect(() => {
  
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, [messages]); 
    
    const handleTextChange = (e) => {
      const newMessageContent = e.target.value; 
      setmessageContent(newMessageContent);
      setFormData({
        ...formData,
        messageContent: newMessageContent, // Update formData with the new messageContent
      });
    
      console.log("messageContent", newMessageContent);
    };
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    };


  return (
      <div>
        <Grid container>
            <Grid item xs={12} >
                <Typography variant="h5" className="header-message">Chat</Typography>
            </Grid>
        </Grid>
        <Grid container component={Paper} >
            <Grid item xs={3}>
                <List>
                    <ListItem button key="RemySharp">
                        <ListItemIcon>
                        <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="John Wick"></ListItemText>
                    </ListItem>
                </List>
                <Divider />
                <Grid item xs={12} style={{padding: '10px'}}>
                    <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                </Grid>
                <Divider />
                <List>
                    <ListItem button key="RemySharp">
                        <ListItemIcon>
                            <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Remy Sharp">Remy Sharp</ListItemText>
                        <ListItemText secondary="online" align="right"></ListItemText>
                    </ListItem>
                    <ListItem button key="Alice">
                        <ListItemIcon>
                            <Avatar alt="Alice" src="https://material-ui.com/static/images/avatar/3.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Alice">Alice</ListItemText>
                    </ListItem>
                    <ListItem button key="CindyBaker">
                        <ListItemIcon>
                            <Avatar alt="Cindy Baker" src="https://material-ui.com/static/images/avatar/2.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Cindy Baker">Cindy Baker</ListItemText>
                    </ListItem>
                </List>
            </Grid>

            <Grid item xs={9} width={"100%"}  >
                <List ref={messagesContainerRef}>
                {messages.flat().map((msg, index) => (
                    msg.messageContent ?   
                    <ListItem key={index}>
                    {msg.senderId === senderId ? (
                        <Grid container>
                            <Grid item xs={12}>
                            <ListItemText 
                            primary={msg.messageContent}
                            secondary={'You'}
                            align="right"
                            sx={{ 
                               
                                background: 'linear-gradient(to bottom right, rgba(252, 203, 144, 1), rgba(213, 126, 235, 1))',
                                borderRadius:"10px",
                                padding:"5px",
                                
                            }} />
                            </Grid>
                            <Grid item xs={12}>
                                <ListItemText align="right" secondary="09:30"></ListItemText>
                            </Grid>
                        </Grid>):(
                            <Grid container>
                                <Grid item xs={12}>
                                <ListItemText 
                                primary={msg.messageContent}
                                secondary={'You'}
                                align="left"
                                sx={{ 
                                   
                                    background: 'linear-gradient(to bottom right, rgba(252, 203, 144, 1), rgba(213, 126, 235, 1))',
                                    borderRadius:"10px",
                                    padding:"5px",
                                    
                                }}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <ListItemText align="right" secondary="09:30"></ListItemText>
                                </Grid>
                            </Grid>)
                        }
                    </ListItem> : null
                    ))} 
                </List>
                <Divider />
                <Grid container style={{padding: '20px'}}>
                <Grid item xs={11}>
                    <TextField id="outlined-basic-email"  fullWidth
                    label="Type your message..."
                    variant="outlined"
                    name="messageContent"
                    value={messageContent}
                    onChange={handleTextChange}
                    onKeyPress={handleKeyPress}  />
                </Grid>
                <Grid xs={1} align="right">
                    <Fab color="primary" aria-label="add"><Send /></Fab>
                </Grid>
                  </Grid>
            </Grid>
        </Grid>
      </div>
  );
}

export default Chat;
