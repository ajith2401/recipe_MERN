import React, { useState,useRef,useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Oauth from './Oauth';
import { signInFailure,signUpSuccess,signStart } from '../redux/user/userSlice.js';
import { useDispatch, useSelector  } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';


function Signup() {
  const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const mobileNumberRegex = /^[0-9]{10}$/;
  const [formData, setFormData]  =  useState({})
  const {error,loading} = useSelector((state) => state.user)
  const navigateTo = useNavigate(); 
  const dispatch = useDispatch()
  const userRef = useRef()

  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const[validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);


  const [validMail, setValidMail] = useState(false);
  const [mailFocus, setMailFocus] = useState(false);

  const hanldeChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signStart())
      const res = await fetch("http://localhost:8080/api/auth/signup", {
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
      dispatch(signUpSuccess(data))
      navigateTo('/signin');
    } catch (error) {
      dispatch(signInFailure(error.message))
      setTimeout(() => dispatch(signInFailure(null)), 2000);
    }
  };

  useEffect(()=>{
    userRef.current.focus()
},[])

useEffect(()=>{
 const isValidName = USER_REGEX.test(formData?.firstName)
 console.log("formData?.firstName",formData?.firstName)
 console.log("ValidName", isValidName)
 setValidName(isValidName)
},[formData?.firstName])


useEffect(()=>{
const isValidPassword = PWD_REGEX.test(formData?.password)
console.log("formData?.password",formData?.password)
console.log("isValidPassword", isValidPassword)
setValidPwd(isValidPassword)
const match = formData?.password === matchPwd;
console.log("matchPwd",matchPwd)
setValidMatch(match)
console.log("ValidMatch",validMatch)
console.log("match",match)
},[formData?.password, matchPwd])

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
       <p className={ error ? "errMsg": "offscreen"} aria-live='assertive'>{error}</p>
      <form id='signUpForm' onSubmit={handleSubmit}>
      <h2> Signup </h2>
        <input
          ref={userRef}
          autoComplete='off'
          onFocus={()=>setUserFocus(true)}
          onBlur={()=>setUserFocus(false)}
          aria-invalid={ validName ? "false":"true"}
          type='text'
          name='firstName'
          aria-describedby='uidnote'
          placeholder='first name'
          required
          onChange={hanldeChange}
        />
        <p id="uidnote" className={userFocus && formData?.firstName && !validName ? "instructions" : "offscreen"}>
  <FontAwesomeIcon icon={faInfoCircle} />
  4 to 24 characters.<br />
  Must begin with a letter.<br />
  Letters, numbers, underscores, hyphens allowed. </p>
        <input type='text' name='lastName' placeholder='last name' onChange={hanldeChange}/>
        <input
          type='password'
          name='password'
          id='password'
          placeholder='password'
          aria-invalid={ validPwd ? "false":"true"}
          aria-describedby='pwdnote'
          onFocus={()=>setPwdFocus(true)}
          onBlur={()=>setPwdFocus(false)}
          required
          onChange={hanldeChange}
        />
        <p id='pwdnote' className={  pwdFocus && !validPwd ? "instructions": "offscreen"}>
        <FontAwesomeIcon icon={faInfoCircle}/>
        8 to 24 characters.<br />
        Must include uppercase and lowercase letters, a number and a special character.<br />
        Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollarsign">$</span><span aria-label="percent">%</span>
        </p>
       
        <input
          type='password'
          name='Re-password'
          id='Re-password'
          onChange={(e)=>setMatchPwd(e.target.value)}
          aria-invalid={ validMatch ? "false" : "true"}
          aria-describedby='confirmnote'
          placeholder='Re-enter password'
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
          required
        />
        <p id='confirmnote' className={ matchFocus && !validMatch ? "instructions" :"offscreen"}>
        <FontAwesomeIcon icon={faInfoCircle}/>
        password doesnt match. please enter the same password which you enterd above
        </p>
        <input
          type='text'
          name='emailOrPhoneNumber'
          placeholder='email or phonenumber'
          required
          aria-invalid={validMail? "false":"true"}
          aria-describedby='mailnote'
          onFocus={()=> setMailFocus(true)}
          onBlur={()=>setMailFocus(false)}
          onChange={hanldeChange}
        />
        <p id='mailnote' className={mailFocus && !validMail ? "instructions" : "offscreen"}>
        <FontAwesomeIcon icon={faInfoCircle}/>
        please enter a valid mail or phone number
        </p>
        <button id='signupBtn' className='signIn' disabled={((!validName || !validPwd) ||!validMatch) || loading}>
          {loading ? "loading" : "Signup"}
        </button>
        <Oauth/>
      <div className='inline'>  <p>have an account  &nbsp; </p> <Link to='/signin'> sign in </Link> </div>
      </form> 
    </div>
    </div>
  );
}

export default Signup;
