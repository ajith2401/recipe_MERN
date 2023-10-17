import React from 'react'
import { useNavigate } from 'react-router-dom'
import {useForm} from 'react-hook-form'

function Login() {
    const navigateTo = useNavigate();
    const form  = useForm();
    const { register, control} = form
  return ( 
    <div>
    <form id='loginForm'>
    <h2> Login </h2>
    <input type='text' placeholder='email or phone nuber' name='emailOrPhonenumber' id='emailOrPhonenumber' {...register("emailOrPhonenumber", {required : "please enter the mail u=id or phone num ber"})}/>
    <input type='password' name='password' id='password' placeholder='password' {...register("password")}/>
    <button id='loginBtn' onClick={()=>navigateTo('/home')}>Login</button>
    </form>
    <p onClick={()=>navigateTo('/forgotPassword')}>forgot password</p> 
    <hr></hr>
    <button id='createAccBtn' onClick={()=>navigateTo('./signup')}>create an account</button>
    </div>
  )
}

export default Login