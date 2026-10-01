import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  const itemClass = 'grid h-9 min-w-9 place-items-center rounded-md border px-2 font-mono text-sm transition-colors';

  return (
    <nav aria-label="Paginación" className="mt-12 flex flex-wrap items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
        className={`${itemClass} border-line text-muted hover:text-accent disabled:opacity-40`}
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && p - (pages[i - 1] ?? p) > 1 && <span className="font-mono text-subtle">…</span>}
          <button
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`${itemClass} ${
              p === page ? 'border-accent/60 bg-accent/10 text-accent' : 'border-line text-muted hover:text-fg'
            }`}
          >
            {p}
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
        className={`${itemClass} border-line text-muted hover:text-accent disabled:opacity-40`}
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
