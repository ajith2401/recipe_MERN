import React from 'react'

function ForgotPassword() {
  return (
    <div id='forgotPasswordForm'>
    <form>
      <label>Please enter your email address or mobile number to search for your account.</label>
      <br></br>
      <input type='text' id="SearchByMailorPhNo" placeholder='Email address or mobile number'/>
      <div className='inlineBtns'>
      <button id='cancelBtn'>Cancel</button>
      <button id='sendOTP'>Send OTP</button>
      </div>
      </form>
    </div>
  )
}

export default ForgotPassword