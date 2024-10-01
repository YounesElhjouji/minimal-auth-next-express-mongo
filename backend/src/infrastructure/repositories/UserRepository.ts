import { User } from '../../domain/entities/UserModel';
import { IUserRepository } from '../../application/interfaces/UserRepoInterface';
import mongoose, { Schema, Document } from 'mongoose';

// Define the User interface extending the Mongoose Document
export interface IUser extends Document {
  email: string;
  provider: string;
  password?: string;
  resetToken?: string;
  googleId?: string;
  facebookId?: string;
}

// Define the User schema
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  provider: { type: String, required: true },
  password: { type: String, default: null },
  resetToken: { type: String, default: null },
  googleId: { type: String, default: null }, // sparse allows multiple null values
  facebookId: { type: String, default: null }, // sparse allows multiple null values
});

// Export the User model
const UserModel = mongoose.model<IUser>('User', UserSchema);

// Implement the repository using MongoDB and Mongoose
export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) return null;
    return userDoc.toObject() as User;
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id);
    if (!userDoc) return null;
    return userDoc.toObject() as User;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ googleId });
    if (!userDoc) return null;
    return userDoc.toObject() as User;
  }

  async findByFacebookId(facebookId: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ facebookId });
    if (!userDoc) return null;
    return userDoc.toObject() as User;
  }

  async save(user: User): Promise<User> {
    const userDoc = new UserModel(user);
    await userDoc.save();
    return user;
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { password });
  }

  async getUserByResetToken(token: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ resetToken: token });
    if (!userDoc) return null;
    return userDoc.toObject() as User;
  }
}
