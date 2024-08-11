import mysql from 'mysql2/promise';
import cfg from '../config';
import log from './logger';

const dbConfig = {
  connectionLimit: 30,
  queueLimit: 0,
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 60000, // 10 seconds
  acquireTimeout: 60000, // 10 seconds
};

export const accountDB = mysql.createPool({...dbConfig, ...cfg.accountDB});
export const contentDB = mysql.createPool({...dbConfig, ...cfg.contentDB});

export async function initDatabases() {
  try {
    await accountDB.query('SELECT 1');
    await contentDB.query('SELECT 1');
    log.info('Database connections established successfully');
  } catch (error) {
    log.error('Error connecting to databases:', error);
    process.exit(1);
  }
}

// 애플리케이션 종료 시 연결 풀 정리
process.on('SIGINT', async () => {
  try {
    await accountDB.end();
    await contentDB.end();
    log.info('Database connections closed');
    process.exit(0);
  } catch (error) {
    log.error('Error closing database connections:', error);
    process.exit(1);
  }
});