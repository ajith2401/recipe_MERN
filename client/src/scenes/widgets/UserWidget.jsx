
import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
  } from "@mui/icons-material";
import { Twitter,LinkedIn } from "@mui/icons-material";

  import { Box, Typography, Divider, useTheme, Icon } from "@mui/material";
  import UserImage from "../../components/UserImage";
  import FlexBetween from "../../components/FlexBetween";
  import WidgetWrapper from "../../components/WidgetWrapper";
  import { useSelector } from "react-redux";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  
  const UserWidget = ({ userId, picturePath }) => {
    const [user, setUser] = useState(null);
    const { palette } = useTheme();
    const navigate = useNavigate();
    const {currentUser} = useSelector((state) => state.user)
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;
  
    const getUser = async () => {
      const response = await fetch(`/api/user/${userId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
      const data = await response.json();
      setUser(data);
    };
  
    useEffect(() => {
      getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
    if (!user) {
      return null;
    }
  
    const {
      firstName,
      lastName,
      location,
      occupation,
      viewedProfile,
      impressions,
      friends,
      avatar
    } = user;
  
    return (
      <WidgetWrapper>
        {/* FIRST ROW */}
        <FlexBetween
          gap="0.5rem"
          pb="1.1rem"
          
        >
          <FlexBetween gap="1rem">
            <UserImage image={picturePath} />
            <Box>
              <Typography
                variant="h4"
                color={dark}
                fontWeight="500"
                onClick={() => navigate(`/profile/${userId}`)}
                sx={{
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}
              >
                {firstName} {lastName ? lastName : ""}
              </Typography>
              <Typography color={medium}>{Array.isArray(friends) ? friends.length : "0"} friends</Typography>
            </Box>
          </FlexBetween>
          <ManageAccountsOutlined onClick={()=> navigate('/updateprofile')} sx={{"&:hover": {color: palette.primary.dark,cursor: "pointer" } }}/>
        </FlexBetween>
  
        <Divider />
  
        {/* SECOND ROW */}
        <Box p="1rem 0">
          <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
            <LocationOnOutlined fontSize="large" sx={{ color: main }} />
            <Typography color={medium}>{location}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap="1rem">
            <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
            <Typography color={medium}>{occupation}</Typography>
          </Box>
        </Box>
  
        <Divider />
  
        {/* THIRD ROW */}
        <Box p="1rem 0">
          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Who's viewed your profile</Typography>
            <Typography color={main} fontWeight="500">
              {viewedProfile}
            </Typography>
          </FlexBetween>
          <FlexBetween>
            <Typography color={medium}>Impressions of your post</Typography>
            <Typography color={main} fontWeight="500">
              {impressions}
            </Typography>
          </FlexBetween>
        </Box>
  
        <Divider />
  
        {/* FOURTH ROW */}
        <Box p="1rem 0">
          <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
            Social Profiles
          </Typography>
  
          <FlexBetween gap="1rem" mb="0.5rem">
            <FlexBetween gap="1rem">
             <Icon><Twitter/></Icon>
              <Box>
                <Typography color={main} fontWeight="500">
                {currentUser.twitter}
                </Typography>
                <Typography color={medium}>Social Network</Typography>
              </Box>
            </FlexBetween>
            <EditOutlined sx={{ color: main }} />
          </FlexBetween>
  
          <FlexBetween gap="1rem">
            <FlexBetween gap="1rem">
              <Icon><LinkedIn/></Icon>
              <Box>
                <Typography color={main} fontWeight="500">
                  {currentUser.linkedIn}
                </Typography>
                <Typography color={medium}>Network Platform</Typography>
              </Box>
            </FlexBetween>
            <EditOutlined sx={{ color: main }} />
          </FlexBetween>
        </Box>
      </WidgetWrapper>
    );
  };
  
  export default UserWidget;