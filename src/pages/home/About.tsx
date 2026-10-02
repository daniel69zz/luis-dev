import { SectionHeading } from '@/components/ui/SectionHeading';
import { TerminalWindow } from '@/components/ui/TerminalWindow';
import { site } from '@/config/site';

function Value({ value }: { value: unknown }) {
  if (typeof value === 'string') return <span className="text-amber">'{value}'</span>;
  if (typeof value === 'boolean' || typeof value === 'number') return <span className="text-[#f78c6c]">{String(value)}</span>;
  if (Array.isArray(value)) {
    return (
      <>
        <span className="text-muted">[</span>
        {value.map((item, i) => (
          <span key={i}>
            <Value value={item} />
            {i < value.length - 1 && <span className="text-muted">, </span>}
          </span>
        ))}
        <span className="text-muted">]</span>
      </>
    );
  }
  return null;
}

export function About() {
  const profile = {
    rol: site.role,
    ubicacion: site.location,
    enfoque: site.about.focus,
    aprendiendo: site.about.learning,
    cafe: site.about.coffee,
  };
  const entries = Object.entries(profile);

  return (
    <section id="sobre-mi" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="01" title="sobre-mí" />
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div className="space-y-4 leading-relaxed text-muted">
          {site.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <TerminalWindow title="sobre-mi.ts">
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6 sm:text-sm">
            <code>
              <span className="text-purple">const</span> <span className="text-fg">{site.handle}</span>{' '}
              <span className="text-muted">=</span> <span className="text-muted">{'{'}</span>
              {'\n'}
              {entries.map(([key, value], i) => (
                <span key={key}>
                  {'  '}
                  <span className="text-cyan">{key}</span>
                  <span className="text-muted">: </span>
                  <Value value={value} />
                  <span className="text-muted">{i < entries.length - 1 ? ',' : ''}</span>
                  {'\n'}
                </span>
              ))}
              <span className="text-muted">{'};'}</span>
            </code>
          </pre>
        </TerminalWindow>
      </div>
    </section>
  );
}
