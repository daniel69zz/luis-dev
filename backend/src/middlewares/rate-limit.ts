import { rateLimit } from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { message: 'Demasiadas solicitudes, intenta más tarde', code: 'RATE_LIMITED' } },
});
