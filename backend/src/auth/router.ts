import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import {
  validateRegistration,
  validateLogin,
  validateRequest,
  validateEmail,
  ensureAuthenticated,
} from './middleware';
import {
  addUser,
  getUserByEmail,
  updateUserPassword,
  getUserByResetToken,
  getUserById,
} from '../users';

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

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = getUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: 'Email not found.' });
  }

  // Generate a reset token
  const resetToken = uuidv4();
  user.resetToken = resetToken;

  // Configure Nodemailer transporter
  const emailAddress = process.env.EMAIL_ADDRESS ?? 'your_email_address';
  const emailPassword = process.env.EMAIL_PASSWORD ?? 'your_email_password';
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: emailAddress,
      pass: emailPassword,
    },
  });

  const resetLink = `http://localhost:3000/auth/reset-password/${resetToken}`;

  const mailOptions = {
    from: emailAddress,
    to: email,
    subject: 'Password Reset',
    text: `Click here to reset your password: ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending email.' });
  }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = getUserByResetToken(token);
  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  updateUserPassword(user.id, hashedPassword);
  delete user.resetToken;
  res.json({ message: 'Password has been reset.' });
});

// Protected pofile route
router.get('/profile', ensureAuthenticated, (req, res) => {
  const user = getUserById(req.user.id);
  res.json({ email: user.email });
});

export default router;
