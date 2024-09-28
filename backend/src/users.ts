import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  password: string;
  resetToken?: string;
}

const users = new Map<string, User>();

export function addUser(email: string, password: string): User {
  const id = uuidv4();
  const user = { id, email, password };
  users.set(id, user);
  return user;
}

export function getUserByEmail(email: string): User | undefined {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return undefined;
}

export function getUserById(id: string): User | undefined {
  return users.get(id);
}

export function updateUserPassword(id: string, password: string): void {
  const user = users.get(id);
  if (user) {
    user.password = password;
  }
}

export function getUserByResetToken(token: string): User | undefined {
  for (const user of users.values()) {
    if (user.resetToken === token) {
      return user;
    }
  }
  return undefined;
}
