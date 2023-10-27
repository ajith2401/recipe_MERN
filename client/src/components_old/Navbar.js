import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigateTo = useNavigate ()
  const {currentUser} = useSelector((state)=> state.user)
    const navLinks = ({isActive}) =>{
        return {
            fontWeight : isActive ? "bold" : "normal",
            textDecoration : isActive ? "none" : 'underline'
        }
    }
  return (
    <nav className='primary-nav'>
    <NavLink style={navLinks} to='/'>Home</NavLink>
    <NavLink style={navLinks} to='/connections'>Connections</NavLink>
    <NavLink style={navLinks} to='/notifications'>Notifications</NavLink>
    <NavLink style={navLinks} to='/menu'>Menu</NavLink>
    <NavLink to='/profile'><img src={currentUser.avatar} alt='profilePic' id='profile_picture'/></NavLink>
    </nav>
  )
}

export default Navbar