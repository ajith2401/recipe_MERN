import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInFailure,signInSuccess,signStart } from '../redux/user/userSlice.js';
import { useDispatch, useSelector  } from 'react-redux';
import Oauth from './Oauth.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';


function Login() {
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileNumberRegex = /^[0-9]{10}$/;
    const navigateTo = useNavigate();
    const dispatch = useDispatch()
    const [formData, setFormData]  =  useState({})
    const [validMail, setValidMail] = useState(false);
    const [mailFocus, setMailFocus] = useState(false);
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
          setTimeout(() => dispatch(signInFailure(null)), 2000);
          return;
      }
      dispatch(signInSuccess(data))
      navigateTo('/')
      } catch (error) {
        dispatch(signInFailure(error.message))
        setTimeout(() => dispatch(signInFailure(null)), 2000);
      }
    }
    useEffect(() => {
      const isEmail = EMAIL_REGEX.test(formData?.emailOrPhoneNumber);
      const isMobileNumber = mobileNumberRegex.test(formData?.emailOrPhoneNumber);
    
      if (isEmail) {
        console.log("Email Address:", formData?.emailOrPhoneNumber);
        setValidMail(true);
      } else if (isMobileNumber) {
        console.log("Mobile Number:", formData?.emailOrPhoneNumber);
        setValidMail(true);
      } else {
        console.log("Invalid input:", formData?.emailOrPhoneNumber);
        setValidMail(false);
      }
    }, [formData?.emailOrPhoneNumber]);
  return ( 
    <div className='signupSection'>
    <div className='box box1'>
    <h2 className='app-name'>Recipe sharing app</h2>
    <p className='app-quote'>Good food is all the sweeter when shared with good friends.</p>
    </div>
    <div className='box box2'>
    <form id='loginForm' onSubmit={handleSubmit}>
    <h2> Login </h2>
    { error && <p style={{ color: "red", transition: "all 1s ease-in-out" }}>{error}</p>}
    <input type="text" placeholder="email or phone number" name="emailOrPhoneNumber" id="emailOrPhoneNumber" onChange={handleOnchange} required
    aria-invalid={validMail? "false":"true"}
    aria-describedby='mailnote'
    onFocus={()=> setMailFocus(true)}
    onBlur={()=>setMailFocus(false)}/>
    <p id='mailnote' className={mailFocus && !validMail ? "instructions" : "offscreen"}>
    <FontAwesomeIcon icon={faInfoCircle}/>
    please enter a valid mail or phone number
    </p>
    <input type='password' name='password' id='password' required placeholder='password' onChange={handleOnchange}/>
    <button id='loginBtn' className='signIn' disabled={loading}>{loading ? "loading" :"Signin"}</button>
    <Oauth/>
    <p onClick={() => navigateTo('/forgotPassword')}>Forgot Password</p>
    <hr></hr>
    <button id='createAccBtn' type='button' onClick={()=>navigateTo('/signup')} className='signIn'>create an account</button>
    </form>
    </div>
    </div>
  )
}

export default Login