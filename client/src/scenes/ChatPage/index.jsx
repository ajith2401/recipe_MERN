import React, { useState } from 'react'
import FlexBetween from '../../components/FlexBetween'
import ChatWidget from '../widgets/ChatWidget'
import { useParams } from 'react-router-dom'
import Navbar from '../NavBar'
import { Box } from '@mui/material'

const ChatPage = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  // ... rest of your code

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleMessages = () => {
    setShowMessages(!showMessages);
  };

  const toggleFriends = ()=>{
    setShowFriends(!showFriends);
  }
   const {friendId} =  useParams()
  return (
    <div>
    <Navbar toggleNotifications={toggleNotifications} toggleMessages={toggleMessages} toggleFriends={toggleFriends} />
    <ChatWidget receiverId={friendId} />
    </div>
   
  )
}

export default ChatPage