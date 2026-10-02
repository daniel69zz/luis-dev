import { ArrowRight, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { ButtonLink } from '@/components/ui/Button';
import { TerminalWindow } from '@/components/ui/TerminalWindow';
import { site } from '@/config/site';
import { listProjects } from '@/features/projects/projects';
import { useTypewriter } from '@/hooks/useTypewriter';

function Prompt() {
  return (
    <span className="select-none">
      <span className="text-accent">{site.handle}@dev</span>
      <span className="text-muted">:</span>
      <span className="text-cyan">~</span>
      <span className="text-muted">$ </span>
    </span>
  );
}

function TerminalDemo() {
  const slugs = listProjects({ limit: 6 }).data.map((project) => project.slug);

  const lines: ReactNode[] = [
    <>
      <Prompt />
      whoami
    </>,
    <span className="text-fg">
      {site.name} <span className="text-muted">—</span> {site.role}
    </span>,
    <>
      <Prompt />
      cat stack.json
    </>,
    <span className="text-muted">{'{'}</span>,
    ...site.stack.slice(0, 3).map(({ category, items }, i, all) => (
      <span className="pl-4">
        <span className="text-cyan">"{category}"</span>
        <span className="text-muted">: [</span>
        {items.slice(0, 3).map((item, j) => (
          <span key={item}>
            <span className="text-amber">"{item}"</span>
            {j < 2 && <span className="text-muted">, </span>}
          </span>
        ))}
        <span className="text-muted">]{i < all.length - 1 ? ',' : ''}</span>
      </span>
    )),
    <span className="text-muted">{'}'}</span>,
    <>
      <Prompt />
      ls proyectos/
    </>,
    <span className="flex flex-wrap gap-x-4 text-purple">
      {slugs.map((slug) => (
        <span key={slug}>{slug}/</span>
      ))}
    </span>,
    <>
      <Prompt />
      <span className="animate-blink text-accent">▋</span>
    </>,
  ];

  return (
    <TerminalWindow title={`${site.handle}@dev: ~ — zsh`}>
      <div className="space-y-1 overflow-x-auto p-5 font-mono text-[13px] leading-6 sm:text-sm">
        {lines.map((line, i) => (
          <div key={i} className="animate-line-in whitespace-nowrap" style={{ animationDelay: `${i * 140}ms` }}>
            {line}
          </div>
        ))}
      </div>
    </TerminalWindow>
  );
}

export function Hero() {
  const tagline = useTypewriter(site.taglines);

  return (
    <section className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <p className="font-mono text-sm text-accent">
          <span className="text-subtle">{'//'}</span> hola, mundo. soy
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-fg sm:text-6xl">{site.name}</h1>
        <p className="mt-4 h-8 font-mono text-lg text-cyan sm:text-2xl" aria-label={site.role}>
          <span className="text-muted">&gt; </span>
          {tagline}
          <span className="animate-blink text-accent">▋</span>
        </p>
        <p className="mt-6 max-w-xl leading-relaxed text-muted">{site.intro}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted">
          {site.available && (
            <span className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              disponible para proyectos
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" /> {site.location}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink to="/proyectos" variant="primary">
            ver proyectos <ArrowRight className="size-4" />
          </ButtonLink>
          <ButtonLink to="/#contacto">contacto</ButtonLink>
          <SocialLinks className="sm:ml-2" />
        </div>
      </div>

      <TerminalDemo />
    </section>
  );
}
