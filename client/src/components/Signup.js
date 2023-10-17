import React from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigateTo = useNavigate()
  return (
    <div>
      <form id='signUpForm'>
      <h2> Signup </h2>
      <input type='text' name='firstName' placeholder='first name' required/>
      <input type='text' name='lastName' placeholder='last name'/>
      <input type='password' id='password' placeholder='password' required/>
      <input type='password' id='Re-password' placeholder='Re enter password' required/>
      <input type='text'  placeholder='email or phonenumber' required/>
      <button onClick={()=>navigateTo('/home')}>Signup</button>
      </form>
    </div>
  )
}

export default Signup