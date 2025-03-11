import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInSuccess } from '../redux/user/userSlice';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { dark } from '@mui/material/styles/createPalette';
import { Google } from '@mui/icons-material';

function Oauth() {
    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    const { loading } = useSelector((state) => state.user);
    
    const handleGoogleAuth = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            
            // These settings help with popup handling
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            const result = await signInWithPopup(auth, provider);
            
            // Make the API request
            const res = await fetch('/api/auth/google', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    firstName: result.user.displayName,
                    emailOrPhoneNumber: result.user.email,
                    avatar: result.user.photoURL
                })
            });
            
            if (!res.ok) {
                throw new Error(`Authentication failed: ${res.status} ${res.statusText}`);
            }
            
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigateTo('/'); 
        } catch (error) {
            console.error('Google auth error:', error);
            dispatch(signInFailure(error.message));
        }
    };
    
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
                    color: "white",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: dark, color: "black", fontWeight: "bold" },
                }}
            >
                <Google /> Continue with Google
            </Button>
        </div>
    );
}

export default Oauth;