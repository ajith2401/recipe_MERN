import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
  } from "@mui/icons-material";
  import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
  import FlexBetween from "../../components/FlexBetween";
  import Friend from "../../components/Friend";
  import WidgetWrapper from "../../components/WidgetWrapper";
  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPost } from "../../redux/user/userSlice";
  
  const PostWidget = ({
    postId,
    authorId,
    authorName,
    title,
    description,
    ingredients,
    instructions,
    image,
    authorAvatar,
    likes,
    comments,
  }) => {
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const {currentUser,posts} = useSelector((state) => state.user);
    console.log("posts",posts)
    const loggedInUserId = currentUser._id;
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
  
    const patchLike = async () => {
      const response = await fetch(`http://localhost:8080/api/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
     dispatch(setPost({ post: updatedPost }));
    };
  
    return (
      <WidgetWrapper m="2rem 0">
        <Friend
          friendId={authorId}
          name={authorName}
          authorAvatar={authorAvatar}
        />
        <Typography color={main} sx={{ mt: "1rem" , fontWeight:"bold", textAlign:"center"}}>
        {title}
      </Typography>
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
        <Typography color={main} sx={{ mt: "1rem" }}>
          {ingredients[0]}
        </Typography>
        <Typography color={main} sx={{ mt: "1rem" }}>
          {instructions}
        </Typography>
        {image && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={image}
          />
        )}
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                { isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>
  
            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>
  
          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
        {isComments && (
          <Box mt="0.5rem">
            {comments.map((comment, i) => (
              <Box key={`${authorName}-${i}`}>
                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  {comment}
                </Typography>
              </Box>
            ))}
            <Divider />
          </Box>
        )}
      </WidgetWrapper>
    );
  };
  
  export default PostWidget;