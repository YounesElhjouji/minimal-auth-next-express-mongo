import { Request, Response, NextFunction } from 'express';
import { UserUsecases } from '../../application/usecases/UserUsecases';
import passport from 'passport';
import { User } from '../../domain/entities/UserModel';

const frontendUrl = process.env.FRONTEND_URL;

export class UserController {
  private userUsecases: UserUsecases;

  constructor(userUseCases: UserUsecases) {
    this.userUsecases = userUseCases;
  }

  // Registration
  async register(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const newUser = await this.userUsecases.addUser(email, 'local', password);
      await this.userUsecases.sendConfirmationEmail(newUser);
      res
        .status(200)
        .json({ message: 'Check email to confirm your account', newUser });
    } catch (err) {
      console.error(err.stack);
      res
        .status(500)
        .json({ message: 'Error registering user', error: err.message });
    }
  }

  async confirmRegistration(req: Request, res: Response) {
    const { token } = req.params;
    await this.userUsecases.confirmUserRegistration(token);
    res.status(200).json({ message: 'User confirmed Successfully' });
  }

  login(req: Request, res: Response) {
    res.json({ message: 'Logged in successfully.' });
  }

  logout(req: Request, res: Response, next: NextFunction) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.json({ message: 'Logged out successfully.' });
    });
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const user = await this.userUsecases.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Email not found.' });
      }
      this.userUsecases.sendResetEmail(user);
      res.json({ message: 'Password reset email sent.' });
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error sending email', error: err.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const user = await this.userUsecases.getUserByResetToken(token);
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
      }
      await this.userUsecases.updateUserPassword(user._id, password);
      res.json({ message: 'Password has been reset.' });
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error resetting password', error: err.message });
    }
  }

  authenticateGoogle(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('google', (err: Error | null, user: User, info) => {
      if (err) {
        return res.redirect(`${frontendUrl}/login?error=Internal server error`);
      }

      if (!user) {
        const errorMessage = info?.message || 'Authentication failed';
        return res.redirect(
          `${frontendUrl}/login?error=${encodeURIComponent(errorMessage)}`
        );
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.redirect(`${frontendUrl}/login?error=Login failed`);
        }

        return res.redirect(`${frontendUrl}/profile`);
      });
    })(req, res, next);
  }

  authenticateFacebook(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('facebook', (err: Error | null, user: User, info) => {
      if (err) {
        return res.redirect(`${frontendUrl}/login?error=Internal server error`);
      }

      if (!user) {
        const errorMessage = info?.message || 'Authentication failed';
        return res.redirect(
          `${frontendUrl}/login?error=${encodeURIComponent(errorMessage)}`
        );
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.redirect(`${frontendUrl}/login?error=Login failed`);
        }

        return res.redirect(`${frontendUrl}/profile`);
      });
    })(req, res, next);
  }
  profile(req, res) {
    this.userUsecases
      .getUserById(req.user._id)
      .then((user) => {
        if (user) {
          res.json({ email: user.email });
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: 'Error fetching profile', error: err.message });
      });
  }
}
