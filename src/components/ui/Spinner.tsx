export function Spinner({ label = 'cargando' }: { label?: string }) {
  return (
    <p role="status" className="font-mono text-sm text-muted">
      <span className="text-accent">$</span> {label}
      <span className="animate-blink ml-0.5 inline-block text-accent">▋</span>
    </p>
  );
}
