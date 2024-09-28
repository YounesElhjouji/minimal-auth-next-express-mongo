import { User } from './users.ts';

declare global {
  namespace Express {
    // Extend Express User interface
    type User = User;
  }
}

export { };
