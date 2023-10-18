import React from 'react'
import { useNavigate } from 'react-router-dom'


function Login() {
    const navigateTo = useNavigate();
   

  return ( 
    <div>
    <form id='loginForm'>
    <h2> Login </h2>
    <input type='text' placeholder='email or phone nuber' name='emailOrPhonenumber' id='emailOrPhonenumber'/>
    <input type='password' name='password' id='password' placeholder='password'/>
    <button id='loginBtn' onClick={()=>navigateTo('/home')}>Login</button>
    </form>
    <p onClick={() => navigateTo('/forgotPassword')}>Forgot Password</p>
    <hr></hr>
    <button id='createAccBtn' onClick={()=>navigateTo('./signup')}>create an account</button>
    </div>
  )
}

export default Login