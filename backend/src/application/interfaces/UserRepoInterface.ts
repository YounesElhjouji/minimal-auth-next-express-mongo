import { User } from '../../domain/entities/UserModel';

export interface IUserRepository {
  findByEmail(email: string, onlyConfirmed?: boolean): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByFacebookId(facebookId: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: string, updatedUser: Partial<User>): Promise<User | null>;
  updatePassword(id: string, password: string): Promise<void>;
  getUserByResetToken(token: string): Promise<User | null>;
  getUserByConfirmationToken(token: string): Promise<User | null>;
}
