import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../redux/user/userSlice";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const {currentUser} = useSelector((state) => state.user);
  const friends = currentUser.friends

  const getFriends = async () => {
  const response = await fetch(
      ` https://ajith-recipe-app.onrender.com/api/user/${userId}/friends`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    console.log("data frid list",data)
    dispatch(setFriends({ friends: data }));
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
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.avatar}
          />
        ))}
      </Box>) :" "}
    </WidgetWrapper>
  );
};

export default FriendListWidget;