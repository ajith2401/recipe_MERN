import express from 'express';
import { signup, signin, google, SignOutUser } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', signin);

// Support both GET and POST methods for Google auth
router.post('/google', google);
router.get('/google', google); // Add support for GET requests

router.get('/signout', SignOutUser);

export default router;