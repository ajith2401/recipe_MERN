import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Notifications from './components/Notifications';
import Connections from './components/Connections';
import Menu from './components/Menu';
import ForgotPassword from './components/ForgotPassword';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/connections' element={<Connections />}></Route>
        <Route path='/notifications' element={<Notifications />}></Route>
        <Route path='/menu' element={<Menu />}></Route>
        <Route path='/forgotPassword' element={<ForgotPassword />}></Route>
      </Routes>
    </div>
  );
}

export default App;