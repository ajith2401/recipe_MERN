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
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, signOutSuccess} from '../../redux/user/userSlice.js'
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween.jsx";
import LoadingIcon from "../../components/LoadingIcon.jsx";
import PropTypes from 'prop-types';
import { io } from "socket.io-client";





const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {error,loading,currentUser} = useSelector((state) => state.user)
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
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
    <p className={ error ? "errMsg": "offscreen"} aria-live='assertive'>{error}</p>
    <p className={ loading ? "errMsg": "offscreen"} aria-live='assertive'><LoadingIcon/></p>
   
        {isNonMobileScreens && (
          <FlexBetween gap="1.75rem">
          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="primary"
            onClick={() => navigate("/")}
            sx={{
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
            }}
          >
           Recipe Sharing
          </Typography>

          </FlexBetween>
        )}
      
      {!isNonMobileScreens && (
        <FlexBetween gap="1rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
        Recipe Sharing
        </Typography> 
        </FlexBetween>
      )}
      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton onClick={()=>{navigate('/chat')
            setMessagesNotification([])}}>
          <Message sx={{ fontSize: "25px" }}  />
          {messagesNotification.length > 0 && (
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
          <Help sx={{ fontSize: "25px" }} />
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
      ) :
      ""
      //  (
      //   <IconButton
      //     onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
      //   >
      //     <Menu />
      //   </IconButton>
      // )
    }

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
            onClick={() => {
              dispatch(setMode());
              setIsMobileMenuToggled(!isMobileMenuToggled)
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
            <Help sx={{ fontSize: "25px" }} />
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

Navbar.propTypes = {
  toggleNotifications: PropTypes.func.isRequired,
  toggleMessages: PropTypes.func.isRequired,
  toggleFriends: PropTypes.func.isRequired,
};


export default Navbar;