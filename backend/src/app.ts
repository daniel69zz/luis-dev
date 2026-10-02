import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import { apiLimiter } from './middlewares/rate-limit.js';
import { getContent } from './modules/projects/projects.content.js';
import { apiV1Router } from './routes.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', env.TRUST_PROXY);

  app.use(
    helmet({
      // Permite que el frontend (otro origen) cargue las imágenes de /media
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(cors({ origin: env.CORS_ORIGINS }));
  app.use(express.json({ limit: '1mb' }));

  // Imágenes de los proyectos. El nombre lleva el hash del archivo, así que se pueden cachear para siempre
  app.get('/media/:slug/:file', (req, res, next) => {
    const filePath = getContent().media.get(`${req.params.slug}/${req.params.file}`);
    if (!filePath) return next();
    res.sendFile(filePath, { maxAge: '30d', immutable: true });
  });

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.use('/api/v1', apiLimiter, apiV1Router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
