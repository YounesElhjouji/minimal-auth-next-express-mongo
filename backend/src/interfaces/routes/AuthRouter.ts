import express, { Request, Response } from 'express';
import passport from 'passport';
import { UserController } from '../controllers/UserController';
import {
  ensureAuthenticated,
  validateRequest,
  validateRegistration,
  validateLogin,
  validateEmail,
} from '../middlewares/AuthMiddlewares';
import { UserUsecases } from '../../application/usecases/UserUsecases';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

const router = express.Router();
const userRepository = new UserRepository(); // Your MongoDB User Repository
const userUseCases = new UserUsecases(userRepository); // Inject repository into use case
const userController = new UserController(userUseCases); // Inject use case into controller
const frontendUrl = process.env.FRONTEND_URL;

// Registration Route
router.post(
  '/register',
  validateRegistration,
  validateRequest,
  validateEmail,
  (req: Request, res: Response) => userController.register(req, res)
);

// Login Route (delegates to passport)
router.post(
  '/login',
  validateLogin,
  passport.authenticate('local'),
  (req: Request, res: Response) => userController.login(req, res)
);

// Logout Route
router.post('/logout', (req, res, next) =>
  userController.logout(req, res, next)
);

// Forgot Password Route
router.post('/forgot-password', (req, res) =>
  userController.forgotPassword(req, res)
);

// Reset Password Route
router.post('/reset-password/:token', (req, res) =>
  userController.resetPassword(req, res)
);

// Google OAuth Route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(`${frontendUrl}/profile`);
  }
);

// Facebook OAuth Route
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(`${frontendUrl}/profile`);
  }
);

// Protected Profile Route
router.get('/profile', ensureAuthenticated, (req, res) => {
  console.log('User router', JSON.stringify(req.isAuthenticated()));
  userController.profile(req, res);
});

export default router;
