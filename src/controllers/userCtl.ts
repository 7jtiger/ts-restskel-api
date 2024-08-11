import { Request, Response } from 'express';
import * as adb from '../models/accounts';
import * as cdb from '../models/contents';
import { comparePassword, generateToken } from '../utils/helper';
import log from '../utils/logger';
import rClient from '../utils/redis';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await adb.getUserByEmail(email);
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken({ userId: user.id });
    // Store token in Redis
    await rClient.set(`auth_${user.id}`, token, 'EX', 86400); // Expires in 24 hours

    res.json({ token });
  } catch (error) {
    log.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ... rest of the code