import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validate } from 'deep-email-validator';
import { UserUsecases } from '../../application/usecases/UserUsecases';

// Basic validation for registration inputs
export const validateRegistrationCredentials = [
  body('email').isEmail().withMessage('Please enter a valid email address.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/\d/)
    .withMessage('Password must contain at least one number.'),
];

export const validateRegistrationUser = (userUsecases: UserUsecases) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await userUsecases.getUserByEmail(req.body.email);
    if (user) {
      res.status(400).json({
        message: `Email already registered for ${user.provider} account. Login to existing account through ${user.provider} authentication.`,
      });
    }
    return next();
  };
};

// Basic validation for login inputs
export const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email address.'),
  body('password').notEmpty().withMessage('Password cannot be empty.'),
];

// Deep email validation using deep-email-validator
export async function validateEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validationResult = await validate(req.body.email);
    if (validationResult.valid) {
      return next();
    }
    res.status(400).json({
      message: 'Specified email is invalid',
      reason: validationResult.reason,
    });
  } catch (error) {
    res.status(500).json({ message: 'Email validation failed', error });
  }
}

// Validation result checker
export function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Ensure user is logged in
export function ensureAuthenticated(req, res, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}
