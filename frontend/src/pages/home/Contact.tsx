import { Mail } from 'lucide-react';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { buttonClass } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/config/site';

export function Contact() {
  return (
    <section id="contacto" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="04" title="contacto" />
      <div className="mx-auto max-w-2xl rounded-xl border border-line bg-surface/60 p-8 text-center sm:p-12">
        <p className="font-mono text-sm text-muted">
          <span className="text-accent">$</span> echo "hola" | mail {site.email}
        </p>
        <h3 className="mt-6 text-2xl font-bold text-fg sm:text-3xl">¿Tienes un proyecto en mente?</h3>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
          Estoy abierto a nuevas oportunidades y colaboraciones. Escríbeme y te respondo lo antes posible.
        </p>
        <div className="mt-8 flex flex-col items-center gap-6">
          <a href={`mailto:${site.email}`} className={buttonClass('primary')}>
            <Mail className="size-4" /> enviar email
          </a>
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
