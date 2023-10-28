import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { signInFailure, signInSuccess } from '../redux/user/userSlice';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { dark } from '@mui/material/styles/createPalette';
import { Google } from '@mui/icons-material';

function Oauth() {
    const dispatch = useDispatch()
    const navigateTo = useNavigate()
    const handleGoogleAuth = async () =>{
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth,provider)
            // https://ajith-recipe-app.onrender.com/api/user/test
            const res = await fetch(`https://ajith-recipe-app.onrender.com/api/auth/google`,{
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
    <Button
    fullWidth
    type="button"
    onClick={handleGoogleAuth}
    sx={{
      m: "2rem 0",
      p: "1rem",
      backgroundColor: "red",
      color:"white",
      fontWeight:"bold",
      "&:hover": { backgroundColor: dark, color:"black", fontWeight:"bold", },
    }}
  >
  <Google/> contine with google 
  </Button>
    </div>
  )
}

export default Oauth
