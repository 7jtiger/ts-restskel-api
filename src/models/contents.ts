import { contentDB } from '../utils/database';

export interface Content {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export const createContent = async (content: Omit<Content, 'id'>): Promise<Content> => {
  const [result] = await contentDB.query(
    'INSERT INTO contents (title, body, userId) VALUES (?, ?, ?)',
    [content.title, content.body, content.userId]
  );
  const id = (result as any).insertId;
  return { id, ...content };
};

export const getContentByUserId = async (userId: number): Promise<Content[]> => {
  const [rows] = await contentDB.query('SELECT * FROM contents WHERE userId = ?', [userId]);
  return rows as Content[];
};

// Add more content-related database operations as needed