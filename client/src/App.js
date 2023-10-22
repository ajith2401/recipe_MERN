import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Notifications from './components/Notifications';
import Connections from './components/Connections';
import Menu from './components/Menu';
import ForgotPassword from './components/ForgotPassword';
import ProtectedRoute from './components/PrivateRoute';
import NoPage from './components/Nopage';
import ProdectSignIn from './components/ProdectSign';
import Profile from './components/Profile';


function App() {

  return ( 
    <div className="App">
   <Routes>
       <Route element={<ProtectedRoute/>}><Route path='/' element={<Home/>}/></Route> 
       <Route element={<ProtectedRoute/>}><Route path='/connections' element={<Connections />}/></Route> 
       <Route element={<ProtectedRoute/>}><Route path='/notifications' element={<Notifications />}/></Route> 
       <Route element={<ProtectedRoute/>}><Route path='/menu' element={<Menu />}/> </Route> 
       <Route element={<ProdectSignIn/>}><Route path='/signin' element={<Login />}/> </Route> 
       <Route element={<ProdectSignIn/>}><Route path='/signup' element={<Signup />}/> </Route> 
       <Route element={<ProtectedRoute/>}><Route path='/profile' element={<Profile/>}/> </Route>     
       <Route element={<ProdectSignIn/>}><Route path='/forgotPassword' element={<ForgotPassword />}/></Route> 
       <Route path='*' element={<NoPage/>}/> 
</Routes>
    </div>
  );
}

export default App;