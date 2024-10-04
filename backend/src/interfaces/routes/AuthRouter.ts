import express, { Request, Response } from 'express';
import passport from 'passport';
import { UserController } from '../controllers/UserController';
import {
  ensureAuthenticated,
  validateRequest,
  validateRegistrationCredentials,
  validateLogin,
  validateEmail,
  validateRegistrationUser,
} from '../middlewares/AuthMiddlewares';
import { UserUsecases } from '../../application/usecases/UserUsecases';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { NodeMailer } from '../../infrastructure/NodeMailer';

const router = express.Router();
const userRepository = new UserRepository();
const mailer = new NodeMailer();
const userUsecases = new UserUsecases(userRepository, mailer);
const userController = new UserController(userUsecases);

// Registration Route
router.post(
  '/register',
  validateRegistrationUser(userUsecases),
  validateRegistrationCredentials,
  validateRequest,
  validateEmail,
  (req: Request, res: Response) => userController.register(req, res)
);

router.post('/confirm-registration/:token', (req: Request, res: Response) =>
  userController.confirmRegistration(req, res)
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
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get('/google/callback', (req, res, next) => {
  userController.authenticateGoogle(req, res, next);
});

// Facebook OAuth Route
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback', (req, res, next) => {
  userController.authenticateFacebook(req, res, next);
});

// Protected Profile Route
router.get('/profile', ensureAuthenticated, (req, res) => {
  userController.profile(req, res);
});

export default router;
