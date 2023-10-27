import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function NoPage() {
    const {currentUser}  = useSelector((state) => state.user)
    return currentUser ?  <Navigate to='/'/>: <Navigate to='/signin'/> 
}

export default NoPage