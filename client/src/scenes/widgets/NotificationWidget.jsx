import { useEffect, useState } from "react";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserImage from "../../components/UserImage";
import FlexBetween from "../../components/FlexBetween";
import PropTypes from 'prop-types';

const NotificationWidget = ({ notification }) => {
  const navigateTo =useNavigate()
  const userId = notification.senderUserId
  const [sender,setSender] = useState('') 
  const { palette } = useTheme();
  // const primaryLight = palette.primary.light;
  // const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
    const getUser = async () => {
        const response = await fetch(`/api/user/${userId}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        console.log("get user data",data)
        setSender(data);
      };
 
      useEffect(() => {
        getUser()
      }, []);
  return (
    <Box p={1}>
      <Paper elevation={3} variant="covered">
      <FlexBetween>
      <UserImage image={sender.avatar} size="30px" />
      <Box
        onClick={() => {
          navigateTo(`/profile/${sender._id}`);
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
    </FlexBetween>
    </Paper>
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
