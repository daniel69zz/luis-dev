import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../utils/http-error.js';

interface ErrorBody {
  error: { message: string; code: string; details?: unknown };
}

function toHttpError(err: unknown): HttpError {
  if (err instanceof HttpError) return err;

  if (err instanceof ZodError) {
    return HttpError.badRequest(
      'Datos inválidos',
      err.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
    );
  }

  // Body JSON mal formado (express.json)
  if (typeof err === 'object' && err !== null && 'type' in err && err.type === 'entity.parse.failed') {
    return HttpError.badRequest('JSON mal formado');
  }

  return new HttpError(500, 'Error interno del servidor', 'INTERNAL_ERROR');
}

export function errorHandler(err: unknown, req: Request, res: Response<ErrorBody>, _next: NextFunction) {
  const httpError = toHttpError(err);

  if (httpError.statusCode >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  res.status(httpError.statusCode).json({
    error: {
      message: httpError.message,
      code: httpError.code,
      ...(httpError.details !== undefined && { details: httpError.details }),
    },
  });
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(HttpError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}
