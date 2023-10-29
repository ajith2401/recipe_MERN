import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInSuccess } from '../redux/user/userSlice';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { dark } from '@mui/material/styles/createPalette';
import { Google } from '@mui/icons-material';

function Oauth() {
    const dispatch = useDispatch()
    const navigateTo = useNavigate()
    const { error,loading, currentUser } = useSelector((state) => state.user);
    const handleGoogleAuth = async () =>{
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth,provider)
            const res = await fetch(`http://localhost:8080/api/auth/google`,{
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
    disabled={loading}
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
