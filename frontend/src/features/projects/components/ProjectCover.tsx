const PALETTE = ['#3ee08f', '#5ccfe6', '#c792ea', '#ffcb6b', '#ff8b6b'];

function hash(value: string) {
  let h = 0;
  for (const char of value) h = (h * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(h);
}

interface ProjectCoverProps {
  title: string;
  slug: string;
  coverUrl: string | null;
  className?: string;
  eager?: boolean;
}

/** Portada del proyecto, o un placeholder generado a partir del slug si no tiene imagen. */
export function ProjectCover({ title, slug, coverUrl, className = '', eager }: ProjectCoverProps) {
  if (coverUrl) {
    return (
      <img
        src={coverUrl}
        alt={`Portada de ${title}`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`size-full object-cover ${className}`}
      />
    );
  }

  const color = PALETTE[hash(slug) % PALETTE.length];
  return (
    <div
      aria-hidden="true"
      className={`relative grid size-full place-items-center overflow-hidden bg-surface-2 ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 30% 20%, ${color}22, transparent 60%), linear-gradient(${color}10 1px, transparent 1px), linear-gradient(90deg, ${color}10 1px, transparent 1px)`,
        backgroundSize: '100% 100%, 20px 20px, 20px 20px',
      }}
    >
      <span className="px-6 text-center font-mono text-lg font-semibold" style={{ color }}>
        &lt;{slug} /&gt;
      </span>
    </div>
  );
}
