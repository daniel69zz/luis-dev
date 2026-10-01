import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/config/site';

export function Stack() {
  return (
    <section id="stack" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="03" title="stack" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {site.stack.map(({ category, items }) => (
          <div
            key={category}
            className="rounded-xl border border-line bg-surface/60 p-5 transition-colors hover:border-accent/40"
          >
            <h3 className="font-mono text-sm font-semibold text-accent">
              {category}
              <span className="text-subtle">/</span>
            </h3>
            <ul className="mt-4 space-y-2 font-mono text-sm text-muted">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-accent/70">▹</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
