import { User } from '../../domain/entities/UserModel';
import { IMailer } from '../interfaces/MailerInterface';
import { IUserRepository } from '../interfaces/UserRepoInterface';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export class UserUsecases {
  private userRepository: IUserRepository;
  private mailer: IMailer;

  constructor(userRepository: IUserRepository, mailer: IMailer) {
    this.userRepository = userRepository;
    this.mailer = mailer;
  }

  async addUser(
    email: string,
    provider: string,
    password?: string,
    googleId?: string,
    facebookId?: string
  ): Promise<User> {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const user = {
      email: email,
      provider: provider,
      password: hashedPassword,
      googleId: googleId,
      facebookId: facebookId,
      isConfirmed: false,
    };
    return this.userRepository.save(user);
  }

  async updateUser(user: User): Promise<User> {
    return this.userRepository.update(user._id, user);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async updateUserPassword(id: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.updatePassword(id, hashedPassword);
  }

  async getUserByResetToken(token: string): Promise<User | null> {
    return this.userRepository.getUserByResetToken(token);
  }

  async sendConfirmationEmail(user: User) {
    const confirmationToken = uuidv4();
    user.confirmationToken = confirmationToken;
    await this.updateUser(user);

    const confirmationLink = `${process.env.FRONTEND_URL}/confirm-registration/${confirmationToken}`;
    await this.mailer.sendEmail(
      user.email,
      'New Account Confirmation',
      `Click here to confirm your new account: ${confirmationLink} \nYou did not create an account? You can ignore this email.`
    );
  }

  async confirmUserRegistration(confirmationToken: string) {
    const user = await this.userRepository.getUserByConfirmationToken(
      confirmationToken
    );
    if (!user) {
      throw new Error(`No user found for given confirmation token`);
    }
    user.isConfirmed = true;
    await this.userRepository.update(user._id, user);
  }

  async sendResetEmail(user: User) {
    const resetToken = uuidv4();
    user.resetToken = resetToken;
    await this.updateUser(user);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await this.mailer.sendEmail(
      user.email,
      'Password Reset',
      `Click here to reset your password: ${resetLink}`
    );
  }

  async getUserBySerializedData(
    id: string,
    provider: string
  ): Promise<User | null> {
    switch (provider) {
      case 'google':
        return await this.userRepository.findByGoogleId(id);
      case 'facebook':
        return await this.userRepository.findByFacebookId(id);
      default: // Assume local users
        return await this.userRepository.findById(id);
    }
  }
}
