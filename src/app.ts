import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cfg from './config';
import log from './utils/logger';
import { initDatabases } from './utils/database';
import redisPool from './utils/redis';
import rt from './routes';
import { notFound, errorHandler } from './middleware/errorHdl';
import { corsMiddleware, securityMiddleware, globalRateLimiter } from './middleware/check';

import { swaggerUi, specs } from './utils/swagger';

const app = express();

// app.use(cors());
app.use(corsMiddleware);
app.use(helmet());
app.use(express.json());
app.use(securityMiddleware);
app.use(globalRateLimiter);

app.use('/api/v01', rt);

if (cfg.server.mode != 'prod') {
  app.use('/swg/v01', swaggerUi.serve, swaggerUi.setup(specs));
}

app.use(notFound);
app.use(errorHandler);

async function startServer() {
  try {
    await initDatabases();
    
    // Redis connection check
    await redisPool.ping();
    log.info('Redis connection established');

    app.listen(cfg.server.port, () => {
      log.info(`Server running on port ${cfg.server.port} in ${cfg.server.mode} mode`);
    });
  } catch (error) {
    log.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();