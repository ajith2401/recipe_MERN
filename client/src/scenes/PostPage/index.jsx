import { useEffect, useState } from 'react';
import PostWidget from '../widgets/PostWidget';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PostPage = () => {
  const { postId } = useParams(); // Destructure postId from the useParams object
  const [posts, setPosts] = useState([]);
  const isProfile = false
  const { error, loading } = useSelector((state) => state.user);
  const getPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("get post data",data)
      setPosts([{...data}]);
     
      console.log("posts",posts)
    } catch (error) {
      console.error('Error fetching post:', error);
      // You might want to handle the error gracefully, e.g., show an error message.
    }
  };

  

  useEffect(() => {
    getPost();
  }, []); // Include postId in the dependency array to fetch the post when it changes.

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

export default PostPage;


 