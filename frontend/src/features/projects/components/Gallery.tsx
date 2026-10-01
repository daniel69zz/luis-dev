import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ProjectImage } from '../types';

export function Gallery({ images, title }: { images: ProjectImage[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
      if (event.key === 'ArrowRight') setActive((i) => (i === null ? i : (i + 1) % images.length));
      if (event.key === 'ArrowLeft') setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, images.length]);

  if (images.length === 0) return null;
  const current = active !== null ? images[active] : undefined;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActive(index)}
            className="aspect-video overflow-hidden rounded-lg border border-line transition-colors hover:border-accent/50"
            aria-label={`Ver imagen ${index + 1} de ${title}`}
          >
            <img
              src={image.url}
              alt={image.alt ?? ''}
              loading="lazy"
              className="size-full object-cover transition-transform hover:scale-105"
            />
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen ${active! + 1} de ${images.length}`}
          className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <img
            src={current.url}
            alt={current.alt ?? ''}
            className="max-h-[85dvh] max-w-full rounded-lg border border-line object-contain"
            onClick={(event) => event.stopPropagation()}
          />
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute right-4 top-4 rounded-md border border-line bg-surface p-2 text-muted hover:text-accent"
          >
            <X className="size-5" />
          </button>
          {images.length > 1 && (
            <div className="absolute bottom-6 flex items-center gap-4 font-mono text-sm text-muted">
              <button
                type="button"
                aria-label="Anterior"
                className="rounded-md border border-line bg-surface p-2 hover:text-accent"
                onClick={(event) => {
                  event.stopPropagation();
                  setActive((active! - 1 + images.length) % images.length);
                }}
              >
                <ChevronLeft className="size-5" />
              </button>
              {active! + 1} / {images.length}
              <button
                type="button"
                aria-label="Siguiente"
                className="rounded-md border border-line bg-surface p-2 hover:text-accent"
                onClick={(event) => {
                  event.stopPropagation();
                  setActive((active! + 1) % images.length);
                }}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
