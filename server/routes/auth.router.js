import express from 'express';
import { signup, signin, google, SignOutUser } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', signin);

// Explicitly handle all methods for the Google auth endpoint
router.route('/google')
  .get((req, res, next) => {
    console.log('GET request to /api/auth/google');
    return google(req, res, next);
  })
  .post((req, res, next) => {
    console.log('POST request to /api/auth/google');
    return google(req, res, next);
  })
  .options((req, res) => {
    console.log('OPTIONS request to /api/auth/google');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.sendStatus(200);
  });

router.get('/signout', SignOutUser);

// Test endpoint to verify API access
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Auth API is working correctly' });
});

export default router;