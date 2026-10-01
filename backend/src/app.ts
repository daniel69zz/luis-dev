import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { localUploadsDir } from './lib/storage/index.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import { apiLimiter } from './middlewares/rate-limit.js';
import { apiV1Router } from './routes.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', env.TRUST_PROXY);

  app.use(
    helmet({
      // Permite que el frontend (otro origen) cargue las imágenes de /uploads
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(cors({ origin: env.CORS_ORIGINS }));
  app.use(express.json({ limit: '1mb' }));

  if (localUploadsDir) {
    app.use('/uploads', express.static(localUploadsDir, { maxAge: '30d', immutable: true, index: false }));
  }

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.use('/api/v1', apiLimiter, apiV1Router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
