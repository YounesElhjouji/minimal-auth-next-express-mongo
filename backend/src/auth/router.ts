import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import {
  validateRegistration,
  validateLogin,
  validateRequest,
  validateEmail,
  ensureAuthenticated,
} from './middleware';
import { addUser, getUserByEmail, getUserById } from '../users';

const router = express.Router();

// Registration Route
router.post(
  '/register',
  validateRegistration,
  validateRequest,
  validateEmail,
  async (req, res) => {
    const { email, password } = req.body;
    if (getUserByEmail(email)) {
      return res.status(400).json({ message: 'Email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    addUser(email, hashedPassword);
    res.status(201).json({ message: 'User registered successfully.' });
  }
);

// Login Route
router.post(
  '/login',
  validateLogin,
  passport.authenticate('local'),
  (req, res) => {
    res.json({ message: 'Logged in successfully.' });
  }
);

// Logout Route
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: 'Logged out successfully.' });
  });
});

// Protected pofile route
router.get('/profile', ensureAuthenticated, (req, res) => {
  const user = getUserById(req.user.id);
  res.json({ email: user.email });
});

export default router;
