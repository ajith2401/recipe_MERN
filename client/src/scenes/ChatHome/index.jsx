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
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import UserImage from '../../components/UserImage';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../NavBar';
import { signOutSuccess } from '../../redux/user/userSlice';

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
        setChattedUsersData([...listOfChattedUsers]); // Update state after the loop
      } 
    } catch (error) {
      console.error('Error fetching chatted users:', error);
    }
  };


  useEffect(() => {
    getChattedUsers();
  }, [senderId]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  // ... rest of your code

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleMessages = () => {
    setShowMessages(!showMessages);
  };

  const toggleFriends = ()=>{
    setShowFriends(!showFriends);
  }
  return (
   <div>
      <Navbar toggleNotifications={toggleNotifications} toggleMessages={toggleMessages} toggleFriends={toggleFriends} /> 
      <div>
       <Grid>
     <Typography variant='h3'>chat</Typography>
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
        <Grid item xs={9} style={{ height: '100vh', overflow: 'auto' ,justifyContent:"center",padding:"0 70px 0 70px", backgroundColor:"gray"}}>        
        <Divider/>
      </Grid> }


       {!isNonMobileScreens && <Grid item xs={12}>
          <List
            style={{
              height: '100vh',
              overflow: 'auto',
              justifyContent: 'center',
              padding: isNonMobileScreens ? '0 70px' : '0',
            }}
            variant={Paper}
          >
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
          <Divider />
        </Grid>}

    
        </Grid> 
    </div>
    </div>
    
  );
};

export default ChatHome;
