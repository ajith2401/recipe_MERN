import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Close,
  Home,
} from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { setMode, signOutSuccess} from '../../redux/user/userSlice.js'
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween.jsx";
import PropTypes from 'prop-types';
import { io } from "socket.io-client";





const NavbarBottom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {currentUser} = useSelector((state) => state.user)
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const alt = theme.palette.background.alt;
  const [messagesNotification, setMessagesNotification] = useState([])
  const [notificationCount, setNotificationCount] = useState([])
  const socket = io('https://ajith-recipe-app.onrender.com', {
    reconnection: true, // Enable reconnection attempts
    reconnectionAttempts: 5, // Maximum number of reconnection attempts
    reconnectionDelay: 1000, // Delay between reconnection attempts (in milliseconds)
  });
  useEffect(()=>{
   socket.connect();
   const userId =  currentUser._id;
   socket.emit('join',userId)
   socket.on("message", (message) => {
    console.log("Received message:", message);
    if (message.receiverId === currentUser._id) {
      setMessagesNotification((prevNotifications) => [
        ...prevNotifications,
        message,
      ]);
    }
   });
    socket.on("like", (notification) => {
      // Handle the 'like' notification here
      console.log("Received a 'like' notification:", notification);
      setNotificationCount((prevNotifications) => [...prevNotifications, notification]);  
  });

   return ()=>{
     socket.disconnect()
   }
 },[])



 const fullName = `${currentUser.firstName} ${currentUser.lastName ? currentUser.lastName : "" }`;

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      {!isNonMobileScreens  && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          zIndex="10"
          maxWidth="500px"
          minWidth="100vw"
          backgroundColor={background}
        >

         <FlexBetween
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap="1rem"
          >
          <IconButton onClick={()=>{navigate('/')} }>
          <Home/>
          </IconButton>
            <IconButton
            onClick={() => {
              dispatch(setMode());
            }}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <IconButton onClick={()=>{navigate('/chat')
            setMessagesNotification([])}}>
          <Message sx={{ fontSize: "25px" }}  />
          {messagesNotification.length > 0  && (
            <div style={{
              position: "absolute",
              top: "0",
              right: "0",
              width: "20px", // Adjust the width and height as needed for your indicator
              height: "20px",
              background: "red", // Set the background color for the indicator
              borderRadius: "50%", // Make it a circle 
            }}>{messagesNotification.length}</div> 
          )}
          </IconButton>
         <IconButton>
         <Notifications onClick={() => {
          navigate('/notifications');
          setNotificationCount([]);
        }}
         sx={{ fontSize: "25px" }} 
         />
         {notificationCount.length > 0  && (
          <div style={{
            position: "absolute",
            top: "0",
            right: "0",
            width: "20px", // Adjust the width and height as needed for your indicator
            height: "20px",
            background: "red", // Set the background color for the indicator
            borderRadius: "50%", // Make it a circle 
          }}>{notificationCount.length}</div> 
        )}</IconButton>
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                  dispatch(signOutSuccess());
                  navigate('/login');
                }}>
                  Log Out
                </MenuItem>
                
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

NavbarBottom.propTypes = {
  toggleNotifications: PropTypes.func.isRequired,
  toggleMessages: PropTypes.func.isRequired,
  toggleFriends: PropTypes.func.isRequired,
};


export default NavbarBottom;