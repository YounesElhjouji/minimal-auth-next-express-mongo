import { User } from '../../domain/entities/UserModel';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByFacebookId(facebookId: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  save(user: User): Promise<User>;
  updatePassword(id: string, password: string): Promise<void>;
  getUserByResetToken(token: string): Promise<User | null>;
}
