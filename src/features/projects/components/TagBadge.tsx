interface TagBadgeProps {
  name: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}

export function TagBadge({ name, active, onClick, count }: TagBadgeProps) {
  const className = `inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs transition-colors ${
    active
      ? 'border-accent/60 bg-accent/15 text-accent'
      : 'border-line bg-surface-2/70 text-cyan/90 hover:border-cyan/40'
  }`;

  const content = (
    <>
      {name}
      {count !== undefined && <span className="text-subtle">{count}</span>}
    </>
  );

  if (!onClick) return <span className={className}>{content}</span>;

  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={className}>
      {content}
    </button>
  );
}
