import { site } from '@/config/site';
import { SocialLinks } from './SocialLinks';

export function Footer() {
  return (
    <footer className="border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="font-mono text-xs text-muted">
          <span className="text-subtle">{'//'}</span> diseñado y construido por{' '}
          <span className="text-fg">{site.name}</span> · {new Date().getFullYear()}
        </p>
        <SocialLinks />
      </div>
    </footer>
  );
}
