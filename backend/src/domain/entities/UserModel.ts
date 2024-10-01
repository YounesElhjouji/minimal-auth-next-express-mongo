export interface User {
  _id?: string;
  email: string;
  provider: string;
  password?: string;
  resetToken?: string;
  googleId?: string;
  facebookId?: string;
}
