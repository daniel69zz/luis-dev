export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code = 'ERROR',
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }

  static badRequest(message = 'Solicitud inválida', details?: unknown) {
    return new HttpError(400, message, 'BAD_REQUEST', details);
  }

  static notFound(message = 'Recurso no encontrado') {
    return new HttpError(404, message, 'NOT_FOUND');
  }
}
