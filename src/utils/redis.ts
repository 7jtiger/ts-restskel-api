import Redis from 'ioredis';
import cfg from '../config';
import log from './logger';

const redisNodes = [
  {
    host: cfg.redis.host,
    port: cfg.redis.port,
  },
];

const MAX_RETRIES = 5;
const INITIAL_DELAY = 1000; // 1초

const redisOptions = {
  redisOptions: {
    username: cfg.redis.user,
    password: cfg.redis.password,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
  },
  clusterRetryStrategy: (times: number) => {
    if (times > MAX_RETRIES) {
      log.error('Max Redis connection retries reached. Giving up.');
      return null; // 연결 시도 중단
    }
    const delay = Math.min(times * INITIAL_DELAY, 30000); // 최대 30초까지 지연
    log.warn(`Retrying Redis connection in ${delay}ms...`);
    return delay;
  },
  scaleReads: 'all',
  maxRedirections: 16,
  retryDelayOnFailover: 100,
};

const redisPool = new Redis.Cluster(redisNodes, {
  ...redisOptions,
  scaleReads: 'slave' // Changed from 'all' to 'slave'
});

redisPool.on('error', (err: Error) => {
  log.error('Redis Pool Error', err);
});

redisPool.on('connect', () => log.info('Redis Pool connected successfully'));

export const getRedisPool = () => redisPool;

export const closeRedisPool = async () => {
  try {
    await redisPool.quit();
    log.info('Redis connection pool closed');
  } catch (error) {
    log.error('Error closing Redis connection pool', error);
  }
};

export const checkRedisPool = async () => {
  try {
    await redisPool.ping();
    return true;
  } catch (error) {
    log.error('Redis connection check failed', error);
    return false;
  }
};

export default redisPool;


/*
const redisClient = new Redis({
  host: cfg.redis.host,
  port: cfg.redis.port,
  username: cfg.redis.user,
  password: cfg.redis.password,
  retryStrategy: (times: number) => {
    if (times > MAX_RETRIES) {
      log.error('Max Redis connection retries reached. Giving up.');
      return null;
    }
    const delay = Math.min(times * INITIAL_DELAY, 30000);
    log.warn(`Retrying Redis connection in ${delay}ms...`);
    return delay;
  },
});

redisClient.on('error', (err: Error) => {
  log.error('Redis Client Error', err);
});

redisClient.on('connect', () => log.info('Redis Client connected successfully'));

export const getRedisClient = () => redisClient;

export const closeRedisClient = async () => {
  try {
    await redisClient.quit();
    log.info('Redis connection closed');
  } catch (error) {
    log.error('Error closing Redis connection', error);
  }
};

export const checkRedisClient = async () => {
  try {
    await redisClient.ping();
    return true;
  } catch (error) {
    log.error('Redis connection check failed', error);
    return false;
  }
};

export default redisClient;
*/