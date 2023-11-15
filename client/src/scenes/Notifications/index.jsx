import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../NavBar";
import UserWidget from "../widgets/UserWidget";
import AdvertWidget from "../widgets/AdvertWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import LoadingIcon from "../../components/LoadingIcon";
import io from "socket.io-client"
import { useEffect, useState } from "react";
import NotificationWidget from "../widgets/NotificationWidget";
import {  signOutSuccess } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import NavbarBottom from "../NavBar/BottomNav";


const NotificationPage = () => {
  const {error,loading,currentUser} = useSelector((state) => state.user)
  const navigateTo = useNavigate()
  const dispatch =useDispatch()
  const _id = currentUser._id;
  const picturePath = currentUser.avatar
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const socket = io('https://ajith-recipe-app.onrender.com', {
    reconnection: true, // Enable reconnection attempts
    reconnectionAttempts: 5, // Maximum number of reconnection attempts
    reconnectionDelay: 1000, // Delay between reconnection attempts (in milliseconds)
  });
  const { palette } = useTheme();
  const recipientUserId = currentUser._id
  const [notification ,setNotification] = useState([])
  // ... rest of your code


  const getNotification = async () => {
    try {
      const response = await fetch(`/api/notification/${recipientUserId}`, {
        method: "GET",
        credentials: "include",
      });
      if (response.status === 401) {
        // Unauthorized error handling
         dispatch(signOutSuccess())
         navigateTo('/login')
      }
      else{
        const data = await response.json();
        console.log("get notifi data",data)
        setNotification((prevNotifications) => [...prevNotifications, ...data]);
  
      }
    } catch (error) {
      dispatch(signOutSuccess())
      navigateTo('/login')
    }
    
    
  };

  useEffect(()=>{
    getNotification()
    socket.connect();
    const userId = _id;
    socket.emit('join',userId)
    socket.on("like", (notification) => {
      // Handle the 'like' notification here
      console.log("Received a 'like' notification:", notification);
      setNotification((prevNotifications) => [...prevNotifications, notification]);
    });
    return ()=>{
      socket.disconnect()
    }
  },[])

  const userNotifications = notification.filter(
    (notificationItem) => notificationItem.recipientUserId === currentUser._id
  );
  

  return (
    <Box height={"100vh"}>
      <Navbar />
      <p className={ error ? "errMsg": "offscreen"} aria-live='assertive'>{error}</p>
      <p className={ loading ? "errMsg": "offscreen"} aria-live='assertive'><LoadingIcon/></p>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          sx={{
            backgroundColor : palette.background.alt,
          }}
        >
        {userNotifications.map((notificationItem) => (
            <NotificationWidget key={notificationItem.id} notification={notificationItem} />
          ))}
        </Box> 
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
            <Box m="2rem 0" />
          </Box>
        )}
      </Box>
      <NavbarBottom/>
    </Box>
  );
};

export default NotificationPage;
