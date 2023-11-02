import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
  } from "@mui/icons-material";
  import { Box, Divider, IconButton, TextareaAutosize, Typography, useTheme } from "@mui/material";
  import FlexBetween from "../../components/FlexBetween";
  import Friend from "../../components/Friend";
  import WidgetWrapper from "../../components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPost } from "../../redux/user/userSlice";
  import PropTypes from 'prop-types';
import UserImage from "../../components/UserImage";
  
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
    isProfile
  }) => {
    const [isComments, setIsComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [commentsToDisplay, setCommentsToDisplay] = useState([]);
    const dispatch = useDispatch();
    const {currentUser,posts} = useSelector((state) => state.user);
    console.log("posts",posts)
    const loggedInUserId = currentUser._id;
    const commetUserName = (currentUser.firstName) + (currentUser.lastName  ? currentUser.lastName  : "")
    const commetUserAvatar =currentUser.avatar
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
     console.log( "authorId,authorName", authorId,
     authorName,)
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
    const patchLike = async () => {
      const response = await fetch(`/api/posts/${postId}/like`, {
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

    const toggleComments = () => {
      setIsComments(!isComments);
    };
  
    const handleCommentChange = (event) => {
      setNewComment(event.target.value);
    };

    console.log("Received comments prop:", comments);

  
    const handleCommentSubmit = async (postId, newComment, userId)=> {

      if (newComment.trim() !== '') {
        try {
          const response = await fetch(`/api/posts/${postId}/comment`, {
            method: "PATCH",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              comment: newComment,
              userId: userId,
              commetUserName : commetUserName,
              commetUserAvatar : commetUserAvatar
            }),
            credentials:"include"
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
          }
          const data = await response.json();
          console.log("Data from API comment:", data);
          setCommentsToDisplay([...comments,data.comments]);
          setNewComment('');
        } catch (error) {
          console.error("Error fetching comment:", error);
          setCommentsToDisplay([]); 
        }
        
      }
      
      
    };


    return (
      <WidgetWrapper m="2rem 0">
        <Friend
          friendId={authorId}
          name={authorName}
          authorAvatar={authorAvatar}
          isProfile
          fontWeight="bold"
        />
        <Typography variant="h3" color={main} sx={{ mt: "1rem", fontWeight: "bold", textAlign: "center" }}>
        {title}
      </Typography>      
      <Typography color={main} sx={{ mt: "1rem" }}>
       <h5>Description: </h5> {description}
       </Typography>
       <h5>Ingredients: </h5>
       
       {Array.isArray(ingredients) && ingredients.length > 0 ? (
        ingredients.map((item, index) => (
          <Typography key={index} color={main} sx={{ mt: "1rem" }}>
            {index + 1}: {item}
          </Typography>
        ))
      ) : ingredients ? ingredients : null}      
         
        <Typography color={main} sx={{ mt: "1rem" }}>
        <h5>instructions: </h5>  {instructions}
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
            <IconButton onClick={toggleComments}>
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
          <Box mt="0.5rem" >
                {comments.map((comment, i) => (
                  <Box key={`${authorName}-${i}`} display={"flex"} flexDirection={"row"} sx={{ m: "0.5rem", p: "0.5rem" }}>
                    <Divider />
                    <UserImage image={comment.commetUserAvatar} size="20px" sx={{ m: "0.5rem 0", pl: "1rem" }}/> 
                    <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                    {comment.text}
                  </Typography>
                  </Box>
                ))}
            <Divider />
            <FlexBetween gap="0.3rem">
            <TextareaAutosize
                variant="outlined"
                fullWidth
                placeholder="Type your comment..."
                value={newComment}
                onChange={handleCommentChange}
                sx={{ marginTop: '1rem', padding: '1rem' }}
              />
              <button onClick={() => handleCommentSubmit(postId, newComment, authorId)}>Post Comment</button>
              </FlexBetween>
          </Box>
        )}
      </WidgetWrapper>
    );
  };

  PostWidget.propTypes = {
    postId: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
    instructions: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    authorAvatar: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        authorId: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      })
    ).isRequired,
    isProfile: PropTypes.bool.isRequired,
  };
  
  
  export default PostWidget;