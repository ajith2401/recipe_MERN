import { useEffect, useState } from "react";
import { Box, Divider, Paper, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserImage from "../../components/UserImage";
import PropTypes from 'prop-types';
import { signOutSuccess } from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";

const NotificationWidget = ({ notification }) => {
  const navigateTo =useNavigate()
  const dispatch = useDispatch()
  const userId = notification.senderUserId
  const [sender,setSender] = useState('') 
  const { palette } = useTheme();
  // const primaryLight = palette.primary.light;
  // const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
    const getUser = async () => {
      try {
        
        const response = await fetch(`/api/user/${userId}`, {
          method: "GET",
          credentials: "include",
        });
        if (response.status === 401) {
          // Unauthorized error handling
           dispatch(signOutSuccess())
           navigateTo('/login')
        } else {
        const data = await response.json();
        console.log("get user data",data)
        setSender(data);
        }
      } catch (error) {
       console.log("error",error.message)
   
      }
       
      };
 
      useEffect(() => {
        getUser()
      }, []);
  return (
    <Box p={1}>
      <Paper elevation={3} variant="covered">
      <Box sx={{
        display:"flex"
      }}>
      <UserImage image={sender.avatar} size="30px" sx={{
        margin:"2px",
        padding:"2px",
      }}/>
      <Box
        onClick={() => {
          navigateTo(`/profile/${sender._id}`);
        }}
        sx={{
          margin:"2px",
          padding:"2px",
        }}
      >
        <Typography
          color={main}
          variant="h5"
          fontWeight="100"
          sx={{
            "&:hover": {
              color: palette.primary.light,
              cursor: "pointer",
            },
          }}
        >{sender.firstName? sender.firstName.toString().trim() : null} {sender.lastname? sender.lastname.toString().trim() : null} liked your post!
        </Typography>
        <Typography color={medium} fontSize="0.75rem">
        {notification.createdAt}
        </Typography>
      </Box>
    </Box>
    </Paper>
    <Divider/>
</Box>
  );
};

NotificationWidget.propTypes = {
  notification: PropTypes.shape({
    // Define the expected properties of the `notification` object.
    // For example:
    senderUserId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    // Add more properties as needed.
  }).isRequired,
};


export default NotificationWidget;
