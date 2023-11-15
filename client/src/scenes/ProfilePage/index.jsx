import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../NavBar";
import FriendListWidget from "../widgets/FriendListWidget"
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import UserWidget from "../widgets/UserWidget";
import LoadingIcon from "../../components/LoadingIcon";
import { signOutSuccess } from "../../redux/user/userSlice";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch()
  const navigateTo = useNavigate()
  const { userId } = useParams();
  const {error,loading} = useSelector((state) => state.user)
 console.log("userId",userId)
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const getUser = async () => {
    const response = await fetch(`/api/user/${userId}`, {
      method: "GET",
      credentials: "include",
    });
    if (  response.status === 401){
    dispatch(signOutSuccess())
    navigateTo('/login')
    }
    else{
      const data = await response.json();
      console.log("get user data",data)
      setUser(data);
    }  
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
    <Navbar />
      <p className={ error ? "errMsg": "offscreen"} aria-live='assertive'>{error}</p>
      <p className={ loading ? "errMsg": "offscreen"} aria-live='assertive'><LoadingIcon/></p>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={user._id} picturePath={user.avatar} />
          <Box m="2rem 0" />
          <FriendListWidget userId={user._id} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={user.avatar} />
          <Box m="2rem 0" />
          <PostsWidget userId={user._id} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;