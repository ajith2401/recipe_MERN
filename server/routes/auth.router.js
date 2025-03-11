import express from 'express';
import { signup, signin, google, SignOutUser } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', signin);

// Support both GET and POST methods for Google auth
router.post('/google', google);
router.get('/google', (req, res) => {
  // For GET requests, return a simple status message
  // This helps with browser preflight checks
  res.status(200).json({ message: 'Google auth endpoint is available' });
});

router.get('/signout', SignOutUser);

// Test endpoint to verify API access
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Auth API is working correctly' });
});

export default router;