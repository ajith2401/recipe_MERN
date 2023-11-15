import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, signOutSuccess } from "../../redux/user/userSlice";
import PostWidget from "./PostWidget";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import ClearIcon from '@mui/icons-material/Clear';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import FlexBetween from "../../components/FlexBetween";
import { Search } from "@mui/icons-material";
import { Box, IconButton, InputBase } from "@mui/material";
import { useTheme } from "@emotion/react";
const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const posts = useSelector((state) => state.user.posts);
  const navigateTo = useNavigate()
  const { error, loading } = useSelector((state) => state.user);
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
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
  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
    console.log("searchText",searchText)
  };
 const filteredWritings = posts
   .filter((post) => {
     if (dateFilter) {
       const filterDate = new Date(dateFilter);
       const writingDate = new Date(post.timestamp);
       if (
         writingDate.getDate() !== filterDate.getDate() ||
         writingDate.getMonth() !== filterDate.getMonth() ||
         writingDate.getFullYear() !== filterDate.getFullYear()
       ) {
         return false;
       }
     }
  
     if (searchText) {
       const lowerCaseSearchText = searchText.toLowerCase();
       const lowerCaseTitle = post.title.toLowerCase();
       const lowerCaseContent = post.description.toLowerCase();
       if (
         !lowerCaseTitle.includes(lowerCaseSearchText) &&
         !lowerCaseContent.includes(lowerCaseSearchText)
       ) {
         return false;
       }
     }
  
      return true;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [isProfile, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
    <Box sx={{
      margin:"4px",
      display:"flex",
      flexDirection:"row",
      gap:"5px"
    }}>
    
    <FlexBetween
    backgroundColor={neutralLight}
    borderRadius="9px"
    gap="3rem"
    padding="0.1rem 1.5rem"
  >
    <InputBase
      placeholder="Search..."
      value={searchText}
      onChange={handleSearchTextChange}
    />
    {searchText ? (
      <IconButton className="undo-button" onClick={() => setSearchText('')}>
        <ClearIcon />
      </IconButton>
    ) : (
      <IconButton>
        <Search />
      </IconButton>
    )}
  </FlexBetween>
  
  <FlexBetween>
  <LocalizationProvider dateAdapter={AdapterDayjs} width="10px">
    <DemoContainer
      components={[
        'DatePicker',
        'MobileDatePicker',
        'DesktopDatePicker',
        'StaticDatePicker',
      ]}
    >
      <DemoItem>
        <DesktopDatePicker value={dateFilter} onChange={(date) => setDateFilter(date)} />
      </DemoItem>
  
    </DemoContainer>
  </LocalizationProvider>
</FlexBetween>
{dateFilter && (
  <IconButton onClick={() => setDateFilter(null)}>
    <ClearIcon />
  </IconButton>
)}
   </Box>
   

  {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) :  posts?.length > 0 ? (
        filteredWritings.map(({
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
