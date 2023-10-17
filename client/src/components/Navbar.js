import React from 'react'
import { NavLink } from 'react-router-dom'

function Navbar() {
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
    </nav>
  )
}

export default Navbar