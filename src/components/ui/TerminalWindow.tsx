import type { ReactNode } from 'react';

interface TerminalWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/** Contenedor con aspecto de ventana de terminal / editor. */
export function TerminalWindow({ title, children, className = '' }: TerminalWindowProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-line bg-surface/90 shadow-2xl shadow-black/40 backdrop-blur ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-line bg-surface-2/80 px-4 py-2.5">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate font-mono text-xs text-muted">{title}</span>
      </div>
      {children}
    </div>
  );
}
