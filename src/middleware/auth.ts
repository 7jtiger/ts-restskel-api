import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cfg from '../config';
import rClient from '../utils/redis';
import log from '../utils/logger';

const TOKEN_CACHE_PREFIX = 'token_cache_';
const TOKEN_CACHE_TTL = 300; // 5분 (초 단위)

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.redirect(cfg.server.authRedirectUrl);

  try {
    // JWT 검증
    const decoded = jwt.verify(token, cfg.jwt.secret) as { userId: string };

    // 캐시에서 토큰 검증 결과 확인
    const cacheKey = `${TOKEN_CACHE_PREFIX}${token}`;
    let isValid = await rClient.get(cacheKey);

    if (isValid === null) {
      // 캐시에 없으면 Redis에서 확인
      const storedToken = await rClient.get(`auth_${decoded.userId}`);
      isValid = storedToken === token ? 'true' : 'false';

      // 검증 결과를 캐시에 저장
      await rClient.set(cacheKey, isValid, 'EX', TOKEN_CACHE_TTL);
    }

    if (isValid !== 'true') {
      return res.redirect(cfg.server.authRedirectUrl);
    }

    (req as any).user = decoded;
    next();
  } catch (error) {
    // JWT 검증 실패 시 즉시 리다이렉트
    log.error('Authentication error:', error);
    return res.redirect(cfg.server.authRedirectUrl);
  }
};