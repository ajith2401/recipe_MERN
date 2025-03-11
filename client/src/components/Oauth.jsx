import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Google } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Oauth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      console.log('Starting Google authentication...');
      
      // Get auth from Google
      const { email, name, photoURL } = await signInWithGoogle();
      
      console.log('Google authentication successful, user:', email);
      
      // Prepare user data
      const userData = {
        firstName: name || 'Google User',
        emailOrPhoneNumber: email,
        avatar: photoURL || '',
      };
      
      console.log('Sending user data to backend:', userData);
      
      // Log preflight request
      console.log('Sending preflight request...');
      
      // Handle preflight manually for debugging
      const preflightCheck = await fetch('/api/auth/google', {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
      });
      
      console.log('Preflight response:', preflightCheck.status);
      
      // Main request
      console.log('Sending POST request to /api/auth/google');
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      
      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status} ${await response.text()}`);
      }
      
      const data = await response.json();
      console.log('Server response:', data);
      
      if (data.success === false) {
        throw new Error(data.message);
      }
      
      dispatch(signInSuccess(data));
      navigate('/');
      
    } catch (error) {
      console.log('Google auth error:', error);
    }
  };

  async function signInWithGoogle() {
    // Mock function for Google auth - replace with your actual implementation
    // This would typically use Firebase or another auth provider
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          email: 'user@example.com',
          name: 'Example User',
          photoURL: 'https://example.com/photo.jpg'
        });
      }, 1000);
    });
  }

  return (
    <Box sx={{ mt: 1 }}>
      <Button
        type="button"
        fullWidth
        variant="contained"
        sx={{
          mb: 2,
          bgcolor: '#4285F4',
          color: 'white',
          '&:hover': {
            bgcolor: '#3367D6',
          },
        }}
        startIcon={<Google />}
        onClick={handleGoogleAuth}
      >
        <Typography sx={{ textTransform: 'none' }}>Continue with Google</Typography>
      </Button>
    </Box>
  );
}