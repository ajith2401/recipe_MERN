import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

function Navbar() {
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
    <img src={currentUser.avatar} alt='profilePic' id='profile_picture'/>
    </nav>
  )
}

export default Navbar