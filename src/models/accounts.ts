import { accountDB } from '../utils/database';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const [result] = await accountDB.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [user.username, user.email, user.password]
  );
  const id = (result as any).insertId;
  return { id, ...user };
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await accountDB.query('SELECT * FROM users WHERE email = ?', [email]);
  return (rows as User[])[0] || null;
};

// Add more account-related database operations as needed