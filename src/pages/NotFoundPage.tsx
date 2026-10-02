import { useLocation } from 'react-router';
import { ButtonLink } from '@/components/ui/Button';
import { TerminalWindow } from '@/components/ui/TerminalWindow';

export function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <div className="mx-auto grid min-h-[70dvh] max-w-2xl place-items-center px-4 py-16">
      <title>404 — no encontrado</title>
      <TerminalWindow title="zsh — 404" className="w-full">
        <div className="space-y-2 p-6 font-mono text-sm">
          <p>
            <span className="text-accent">$</span> cd {pathname}
          </p>
          <p className="text-danger">cd: no such file or directory: {pathname}</p>
          <p className="pt-2 text-muted">La página que buscas no existe o fue movida.</p>
          <div className="pt-4">
            <ButtonLink to="/" variant="primary" size="sm">
              cd ~
            </ButtonLink>
          </div>
        </div>
      </TerminalWindow>
    </div>
  );
}
