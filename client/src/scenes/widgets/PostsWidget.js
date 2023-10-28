import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../redux/user/userSlice";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.user.posts);
  const {error,loading,currentUser} = useSelector((state) => state.user)
  const server_url = process.env.server_url
  
  const getPosts = async () => {
    const response = await fetch(`${server_url}/posts/posts`, {
      method: "GET",
      credentials: "include",

    });
    const data = await response.json();
    console.log("Data from API response:", data);
    dispatch(setPosts ({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `${server_url}/posts/${userId}/posts`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    console.log("Data from API response from profile:", data);
    dispatch(setPosts({ posts: data }));
  };

  console.log("isProfile",isProfile)
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
      ) : posts?.length > 0 ? (  // Use optional chaining here
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
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={authorId}
            name={authorName}
            title={title}
            description={description}
            ingredients={ingredients}
            instructions={instructions}
            image={image}
            userPicturePath={authorAvatar}
            likes={likes}
            comments={comments}
          />
        )
      )) : (
        <p>No posts available.</p>
      )}
    </div>
  );
  
  
  
};

export default PostsWidget;