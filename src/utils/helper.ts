import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cfg from '../config';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, cfg.jwt.secret, { expiresIn: '1d' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, cfg.jwt.secret);
};