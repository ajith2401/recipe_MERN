import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInFailure,signInSuccess,signStart } from '../redux/user/userSlice.js';
import { useDispatch, useSelector  } from 'react-redux';


function Login() {
    const navigateTo = useNavigate();
    const dispatch = useDispatch()
    const [formData, setFormData]  =  useState({})
    const {error,loading} = useSelector((state) => state.user)
    const handleOnchange = (e) =>{
      setFormData({
        ...formData,
        [e.target.name] : e.target.value 
      })
     }
    const handleSubmit = async (e) =>{
      e.preventDefault();
      try {
        dispatch(signStart())
        const res = await fetch("http://localhost:8080/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(signInFailure(data.message))
          return;
      }
      dispatch(signInSuccess(data))
      navigateTo('/home')
 
      } catch (error) {
        dispatch(signInFailure(error.message))
      }
    }
  return ( 
    <div>
    <h2> Login </h2>
    <form id='loginForm' onSubmit={handleSubmit}>
    {error && <p style={{"color":"red"}}>{error}</p>}
    <input type="text" placeholder="email or phone number" name="emailOrPhoneNumber" id="emailOrPhoneNumber" onChange={handleOnchange} />
    <input type='password' name='password' id='password' placeholder='password' onChange={handleOnchange}/>
    <button id='loginBtn' disabled={loading}>{loading ? "loading" :"Signin"}</button>
    </form>
    <p onClick={() => navigateTo('/forgotPassword')}>Forgot Password</p>
    <hr></hr>
    <button id='createAccBtn' onClick={()=>navigateTo('/signup')}>create an account</button>
    </div>
  )
}

export default Login