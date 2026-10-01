import { ApiError } from '@/lib/api-client';

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const message = error instanceof ApiError ? error.message : 'Algo salió mal';

  return (
    <div role="alert" className="rounded-lg border border-danger/30 bg-danger/5 p-5 font-mono text-sm">
      <p className="text-danger">
        <span className="font-semibold">error:</span> {message}
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-3 text-muted underline underline-offset-4 hover:text-fg">
          reintentar
        </button>
      )}
    </div>
  );
}
