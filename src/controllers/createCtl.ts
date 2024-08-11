import { Request, Response } from 'express';
// import * as accountModel from ' ../models/account';
import * as adb from '../models/accounts';
import * as cdb from '../models/contents';
import { hashPassword } from '../utils/helper';
import log from '../utils/logger';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await adb.createUser({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    log.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createContent = async (req: Request, res: Response) => {
  try {
    const { title, body, userId } = req.body;
    const content = await cdb.createContent({ title, body, userId });
    res.status(201).json({ message: 'Content created successfully', contentId: content.id });
  } catch (error) {
    log.error('Error creating content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};