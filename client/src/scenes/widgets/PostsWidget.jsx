import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../redux/user/userSlice";
import PostWidget from "./PostWidget";
import PropTypes from 'prop-types';

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.user.posts);
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
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      dispatch(setPosts({ posts: [] })); 
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

      const data = await response.json();
      console.log("Data from API response from profile:", data);
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error("Error fetching user posts:", error);
      dispatch(setPosts({ posts: [] })); 
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
