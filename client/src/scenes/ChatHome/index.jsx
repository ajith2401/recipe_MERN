import { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  ListItemIcon,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import UserImage from '../../components/UserImage';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../NavBar';
import { signOutSuccess } from '../../redux/user/userSlice';
import { Home } from '@mui/icons-material';
import NavbarBottom from '../NavBar/BottomNav';

const ChatHome = () => {
  const navigateTo = useNavigate()
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user);
  const senderId = currentUser._id;
  const theme = useTheme();
  const [chattedUsersData,setChattedUsersData] = useState([]);
  const isNonMobileScreens = useMediaQuery(theme.breakpoints.up('md'));

  const getChattedUsers = async () => {
    try {
      const response = await fetch(`/api/chat/chattedusers/${senderId}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.status === 401) {
        // Unauthorized error handling
         dispatch(signOutSuccess())
         navigateTo('/login')
      }
      else {
        const data = await response.json();
        const listOfChattedUsers = [];

        for (const userId of data) {
          try {
            const userResponse = await fetch(`/api/user/${userId}`, {
              method: 'GET',
              credentials: 'include',
            });

            if (userResponse.status === 200) {
              const userData = await userResponse.json();
              listOfChattedUsers.push(userData);
            } else {
              console.error(`Failed to fetch user data for user ID: ${userId}`);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
        console.log("listOfChattedUsers",listOfChattedUsers)
        const sortedChattedUsersData = listOfChattedUsers.sort((a, b) => {
          const aTimestamp = a.messages && a.messages.length > 0 ? a.messages[0]?.timestamp : 0;
          const bTimestamp = b.messages && b.messages.length > 0 ? b.messages[0]?.timestamp : 0;
          return bTimestamp - aTimestamp;
        });
        
        setChattedUsersData([...sortedChattedUsersData]); // Update state after the loop
      } 
    } catch (error) {
      console.error('Error fetching chatted users:', error);
    }
  };


  useEffect(() => {
    getChattedUsers();
  }, [senderId]);

  return (
   <div>
      <Navbar/> 
      <div>
      <Grid gap={"1rem"} sx={{
        height:"50px",
        background: 'linear-gradient(to bottom right, rgba(252, 203, 144, 1), rgba(213, 126, 235, 1))',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        padding:"5px 0"
      }}>
     
      <Typography variant='h3' color={'white'} fontWeight={"bold"} fullWidth>Chat</Typography>
      </Grid>
        <Grid container component={Paper}>
        {isNonMobileScreens && 
        <Grid item xs={3}>
            <Divider />
            <Grid item xs={12} style={{padding: '10px'}}>
                <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
            </Grid> 
            <List>
            <Divider/>
            {chattedUsersData.map((chatUser, index) => (
              <ListItem button key={index}  onClick={() => {
                        navigateTo(`/chat/${chatUser._id}`);
                      }}
                   >
                <ListItemIcon>
                  <UserImage image={chatUser.avatar} size="50px" />
                </ListItemIcon>
                <ListItemText
                  primary={chatUser.firstName ? chatUser.firstName :"" + chatUser.lastName ? chatUser.lastName :""} />
                <ListItemText secondary="online" align="right" />
              </ListItem>
            ))}
            </List>
            </Grid>
          } 
          {isNonMobileScreens && 
        <Grid item xs={9} fullWidth style={{ height: '90vh', overflow: 'auto' ,justifyContent:"center",padding:"0 70px 0 70px", backgroundColor:"gray"}}>        
        <Divider/>
      </Grid> }
      {!isNonMobileScreens && (
        <Grid item xs={12} fullWidth>
          {Array.isArray(chattedUsersData) && chattedUsersData.length > 0  ? (
            <List
              style={{
                height: '90vh',
                overflow: 'auto',
                justifyContent: 'center',
                padding: isNonMobileScreens ? '0 70px' : '0',
              }}
              variant="paper"
            >
              {chattedUsersData.map((chatUser, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => {
                    navigateTo(`/chat/${chatUser._id}`);
                  }}
                >
                  <ListItemIcon>
                    <UserImage image={chatUser.avatar} size="50px" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      chatUser.firstName || chatUser.lastName
                        ? `${chatUser.firstName ? chatUser.firstName : ''} ${chatUser.lastName ? chatUser.lastName : ''}`
                        : 'Unknown User'
                    }
                  />
                  <ListItemText secondary="online" align="right" />
                  <Divider />
                </ListItem>
              ))}
            </List>
          ) : (
            <Grid
              item
              fullWidth
              style={{
                height: '90vh',
                overflow: 'auto',
                justifyContent: 'center',
                padding: isNonMobileScreens ? '0 70px' : '0',
                backgroundColor: 'gray',
                color:"white"
              }}
            >
              <Typography variant="h5">There are no friends to chat.</Typography>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                <Typography>Go to the home page and find some new friends to chat.</Typography>
                <IconButton onClick={() => navigateTo('/')} sx={{
                  "&:hover": {
                    cursor: "pointer", 
                  },
                }}>
                  <Home />
                </IconButton>
              </div>
            </Grid>
          )}
          <Divider />
        </Grid>
      )}
      

    
        </Grid> 
    </div>
    <NavbarBottom/>
    </div>
    
  );
};

export default ChatHome;
