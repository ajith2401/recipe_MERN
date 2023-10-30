import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../redux/user/userSlice";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import ChatWidget from "../scenes/widgets/ChatWidget";
import { useState } from "react";

const Friend = ({ friendId, name, subtitle, authorAvatar ,isProfile}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const friends = currentUser.friends
  const id = currentUser._id
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
console.log("authorAvatar from frnd",authorAvatar)
  const isFriend = Array.isArray(friends) ? (friends.find((friend) => friend._id === friendId)) : false;
  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:8080/api/user/${id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include"
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };


  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={authorAvatar} size="55px" />
        <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Typography
        color={main}
        variant="h5"
        fontWeight="500"
        sx={{
          '&:hover': {
            color: palette.primary.light,
            cursor: 'pointer',
          },
        }}
      >
        {name}
      </Typography>
      <Typography color={medium} fontSize="0.75rem">
        {subtitle}
      </Typography>
      {isHovered && (
        <div>
          <button onClick={() => navigate(`/profile/${friendId}`)}>Profile</button>
          <button onClick={()=>navigate(`/chat/${friendId}`)}>Send Message</button>
        </div>
      )}
    </Box>
      </FlexBetween>
     { friendId === id ? null :  <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        { (isFriend || id) ?  (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton> }
    </FlexBetween>
  );
};

export default Friend;