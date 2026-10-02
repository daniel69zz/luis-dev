import { ExternalLink } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/config/site';

export function Certifications() {
  return (
    <section id="certificaciones" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="04" title="certificaciones" />
      <div className="grid gap-4 sm:grid-cols-2">
        {site.certifications.map(({ name, issuer, url, image }) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-5 rounded-xl border border-line bg-surface/60 p-5 transition-colors hover:border-accent/40"
          >
            <img src={image} alt="" loading="lazy" width={96} height={96} className="size-24 shrink-0" />
            <div className="min-w-0">
              <h3 className="font-semibold text-fg group-hover:text-accent">{name}</h3>
              <p className="mt-1 text-sm text-muted">{issuer}</p>
              <p className="mt-3 flex items-center gap-1.5 font-mono text-xs text-accent/80">
                verificar <ExternalLink className="size-3.5" />
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
