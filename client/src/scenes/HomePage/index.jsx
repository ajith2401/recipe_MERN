import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../NavBar";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import AdvertWidget from "../widgets/AdvertWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import LoadingIcon from "../../components/LoadingIcon";
import io from "socket.io-client"
import { useEffect, useState } from "react";
import NotificationWidget from "../widgets/NotificationWidget";
import WidgetWrapper from "../../components/WidgetWrapper";


const HomePage = () => {
  const {error,loading,currentUser} = useSelector((state) => state.user)
  const _id = currentUser._id;
  const picturePath = currentUser.avatar
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
   
  const socket = io('https://ajith-recipe-app.onrender.com', {
    reconnection: true, // Enable reconnection attempts
    reconnectionAttempts: 5, // Maximum number of reconnection attempts
    reconnectionDelay: 1000, // Delay between reconnection attempts (in milliseconds)
  });

  const recipientUserId = currentUser._id
  const [notification ,setNotification] = useState([])
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
  const getNotification = async () => {
    const response = await fetch(`/api/notification/${recipientUserId}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    console.log("get notifi data",data)
    setNotification((prevNotifications) => [...prevNotifications, ...data]);
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
  console.log("notification",notification)

  const userNotifications = notification.filter(
    (notificationItem) => notificationItem.recipientUserId === currentUser._id
  );
  

  return (
    <Box>
      <Navbar toggleNotifications={toggleNotifications} toggleMessages={toggleMessages} toggleFriends={toggleFriends} />
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
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
            <Box m="2rem 0" />
            {showNotifications && userNotifications.length > 0 && (
              <WidgetWrapper>
                {userNotifications.map((notificationItem) => (
                  <NotificationWidget key={notificationItem.id} notification={notificationItem} />
                ))}
                </WidgetWrapper>
        )}
          </Box>
        )}
      </Box>

  
    </Box>
  );
};

export default HomePage;
