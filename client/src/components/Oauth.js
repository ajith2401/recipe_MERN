import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { signInFailure, signInSuccess } from '../redux/user/userSlice';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Oauth() {
    const dispatch = useDispatch()
    const navigateTo = useNavigate()
    const handleGoogleAuth = async () =>{
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth,provider)
            const res = await fetch("http://localhost:8080/api/auth/google",{
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({firstName:result.user.displayName , emailOrPhoneNumber : result.user.email, avatar: result.user.photoURL})
            });
            const data = await res.json()
            dispatch(signInSuccess(data))
            navigateTo('/'); 
        } catch (error) {
          dispatch(signInFailure(error.message))
        }
    }
  return (
    <div>
      <button id="OauthBtn"  className='signIn' type='button' onClick={handleGoogleAuth}>Continue with google</button>
    </div>
  )
}

export default Oauth
