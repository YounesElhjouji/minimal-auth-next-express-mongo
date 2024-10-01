import { Request, Response } from 'express';
import { UserUsecases } from '../../application/usecases/UserUsecases';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

export class UserController {
  private userUsecases: UserUsecases;

  constructor(userUseCases: UserUsecases) {
    this.userUsecases = userUseCases;
  }

  // Registration
  async register(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const existingUser = await this.userUsecases.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
      }

      const newUser = await this.userUsecases.addUser(email, 'local', password);
      res
        .status(201)
        .json({ message: 'User registered successfully.', newUser });
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error registering user', error: err.message });
    }
  }

  // Login (delegated to passport middleware)
  login(req: Request, res: Response) {
    res.json({ message: 'Logged in successfully.' });
  }

  // Logout
  logout(req: Request, res: Response, next: any) {
    req.logout((err: any) => {
      if (err) {
        return next(err);
      }
      res.json({ message: 'Logged out successfully.' });
    });
  }

  // Forgot Password
  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const user = await this.userUsecases.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Email not found.' });
      }

      // Generate reset token and save it
      const resetToken = uuidv4();
      user.resetToken = resetToken;
      await this.userUsecases.updateUserPassword(user._id, user.password); // Update the token in the DB

      // Send email with reset link
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Password Reset',
        text: `Click here to reset your password: ${resetLink}`,
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: 'Password reset email sent.' });
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error sending email', error: err.message });
    }
  }

  // Reset Password
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

  // Google/Facebook login can stay as passport middleware routes.

  profile(req, res) {
    console.log('User', JSON.stringify(req.user));
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
