import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends, signOutSuccess } from "../../redux/user/userSlice";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate()
  const { palette } = useTheme();
  const {currentUser} = useSelector((state) => state.user);
  const friends = currentUser.friends


  const getFriends = async () => {
    try {
      const response = await fetch(`/api/user/${userId}/friends`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.status === 401) {
      // Unauthorized error handling
       dispatch(signOutSuccess())
       navigateTo('/login')
    } else {
    const data = await response.json();
    console.log("data frid list",data)
    dispatch(setFriends({ friends: data }));  
    
    } 
    } catch (error) {
        // Unauthorized error handling
        dispatch(signOutSuccess())
        navigateTo('/login')
      }
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      {Array.isArray(friends) && friends.length > 0 ?
        (<Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName ? friend.lastName :""}`}
            subtitle={friend?.occupation}
            authorAvatar={friend.avatar}
          />
        ))}
      </Box>) :" "}
    </WidgetWrapper>
  );
};

FriendListWidget.propTypes = {
  userId: PropTypes.string.isRequired, // Assuming picturePath is a string
};

export default FriendListWidget;