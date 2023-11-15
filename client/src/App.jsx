import { Route, Routes,BrowserRouter } from 'react-router-dom';
import './App.css';
import HomePage from './scenes/HomePage';
import LoginPage from './scenes/LoginPage';
import ProfilePage from './scenes/ProfilePage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import {CssBaseline , ThemeProvider} from "@mui/material";
import {createTheme} from '@mui/material/styles';
import { themeSettings } from './theme';
import UpdateProfile from './scenes/widgets/UpdateProfileWidget';
import ProtectedRoute from './components/PrivateRoute';
import ProdectSignIn from './components/ProdectSign';
import ChatPage from './scenes/ChatPage';
import ChatHome from './scenes/ChatHome';
import PostPage from './scenes/PostPage';
import NotificationPage from './scenes/Notifications';


function App() {
  const mode = useSelector((state)=> state.user.mode)
  const theme = useMemo(()=> createTheme(themeSettings(mode)),[mode])
  return ( 
    <div className="App">
   <BrowserRouter>
   <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Routes>
        <Route element={<ProtectedRoute />}> <Route path='/' element={<HomePage/>}/> </Route>
        <Route element={<ProdectSignIn />}> <Route path='/login' element={<LoginPage/>}/> </Route>
        <Route element={<ProtectedRoute />}> <Route
           path="/profile/:userId"
           element={<ProfilePage />}
         /> </Route>
         <Route element={<ProtectedRoute />}>    <Route
         path="updateprofile"
         element={<UpdateProfile/>}
       /> </Route>
       <Route element={<ProtectedRoute />}> <Route path='/chat/:friendId' element={<ChatPage/>}/> </Route>
       <Route element={<ProtectedRoute />}> <Route path='/chat' element={<ChatHome/>}/> </Route>
       <Route element={<ProtectedRoute />}> <Route path='/notifications' element={<NotificationPage/>}/> </Route>
       <Route path='/post/:postId' element={<PostPage/>}/> 
       </Routes>
       </ThemeProvider>
</BrowserRouter>
    </div>
  );
}

export default App;


