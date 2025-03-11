import express from 'express';
import { signup, signin, google, SignOutUser, forgotPassword, resetPassword } from '../controllers/auth.controller.js';

const router = express.Router();

// Debug middleware for all auth routes
router.use((req, res, next) => {
  console.log(`${req.method} request to ${req.originalUrl}`);
  console.log('Headers:', JSON.stringify(req.headers));
  next();
});

// Signup endpoint
router.post('/signup', signup);

// Signin endpoint
router.post('/signin', signin);

// Google authentication endpoint with detailed logging
router.route('/google')
  .get((req, res, next) => {
    console.log('GET request to /api/auth/google');
    console.log('Body:', JSON.stringify(req.body));
    return google(req, res, next);
  })
  .post((req, res, next) => {
    console.log('POST request to /api/auth/google');
    console.log('Body:', JSON.stringify(req.body));
    return google(req, res, next);
  })
  .options((req, res) => {
    console.log('OPTIONS request to /api/auth/google');
    // Set specific headers for Google auth
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.sendStatus(204); // Use 204 for preflight success
  });

// Signout endpoint
router.get('/signout', SignOutUser);

// Password reset endpoints (including if you have these functions)
if (typeof forgotPassword === 'function') {
  router.post('/forgotpassword', forgotPassword);
}

if (typeof resetPassword === 'function') {
  router.post('/resetpassword', resetPassword);
}

// Test endpoint with detailed response
router.get('/test', (req, res) => {
  res.status(200).json({
    message: 'Auth API is working correctly',
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    headers: req.headers,
    query: req.query
  });
});

export default router;