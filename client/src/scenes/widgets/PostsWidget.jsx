import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, signOutSuccess } from "../../redux/user/userSlice";
import PostWidget from "./PostWidget";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.user.posts);
  const navigateTo = useNavigate()
  const { error, loading } = useSelector((state) => state.user);

  const getPosts = async () => {
    try {
      const response = await fetch(`/api/posts/posts`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Data from API response:", data);
      const postsArray = data.slice().reverse(); // Create a new array and reverse it
      console.log(postsArray); // [5, 4, 3, 2, 1]

      dispatch(setPosts({ posts: postsArray }));
    } catch (error) {
      if (error.status === 401) {
        // Unauthorized error handling
      dispatch(signOutSuccess())
      navigateTo('/login')
        // You can also redirect the user to a login page or show an error message.
      }
      else{
        console.error("Error fetching posts:", error);
        dispatch(setPosts({ posts: [] })); 
      }
     
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await fetch(`/api/posts/${userId}/posts`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      if (response.status === 401) {
        // Unauthorized error handling
         dispatch(signOutSuccess())
         navigateTo('/login')
      } else {
      const data = await response.json();
      console.log("Data from API response from profile:", data);
      dispatch(setPosts({ posts: data }));
      }
    } catch (error) {
      if (error.status === 401) {
        // Unauthorized error handling
      dispatch(signOutSuccess())
      navigateTo('/login')
      }
      else {
         console.error("Error fetching user posts:", error);
        dispatch(setPosts({ posts: [] })); 
      }
     
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [isProfile, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : posts?.length > 0 ? (
        posts.map(({
          _id,
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
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            authorId={authorId}
            authorName={authorName}
            title={title}
            description={description}
            ingredients={ingredients}
            instructions={instructions}
            image={image}
            authorAvatar={authorAvatar}
            likes={likes}
            comments={comments}
            isProfile={isProfile}
          />
        )
      )) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

PostsWidget.propTypes = {
  userId: PropTypes.string.isRequired,
  isProfile: PropTypes.bool.isRequired,
};
export default PostsWidget;
