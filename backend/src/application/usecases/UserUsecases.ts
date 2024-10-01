import { v4 as uuidv4 } from 'uuid';
import { User } from '../../domain/entities/UserModel';
import { IUserRepository } from '../interfaces/UserRepoInterface';
import bcrypt, { hash } from 'bcryptjs';

export class UserUsecases {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
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
    };
    console.log('User to save', JSON.stringify(user));
    return this.userRepository.save(user);
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

  // In UserUsecases class
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
