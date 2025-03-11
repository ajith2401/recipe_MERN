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
            
            // These settings can help with popup handling
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            console.log('Starting Google authentication...');
            const result = await signInWithPopup(auth, provider);
            console.log('Google authentication successful, user:', result.user.email);
            
            const userData = {
                firstName: result.user.displayName,
                emailOrPhoneNumber: result.user.email,
                avatar: result.user.photoURL
            };
            
            console.log('Sending user data to backend:', userData);
            
            // First try to make a preflight OPTIONS request
            try {
                console.log('Sending preflight request...');
                const preflightResponse = await fetch('/api/auth/google', {
                    method: 'OPTIONS',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Preflight response:', preflightResponse.status);
            } catch (preflightError) {
                console.warn('Preflight request failed:', preflightError);
                // Continue anyway
            }
            
            // Now make the actual POST request
            console.log('Sending POST request to /api/auth/google');
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });
            
            console.log('Response status:', res.status);
            console.log('Response headers:', Array.from(res.headers.entries()));
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error('Server response:', errorText);
                throw new Error(`Authentication failed: ${res.status} ${res.statusText}`);
            }
            
            const data = await res.json();
            console.log('Authentication successful, user data:', data);
            
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