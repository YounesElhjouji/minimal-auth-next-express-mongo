export interface User {
  _id?: string;
  email: string;
  provider: string;
  password?: string;
  confirmationToken?: string;
  isConfirmed?: boolean;
  resetToken?: string;
  googleId?: string;
  facebookId?: string;
}
