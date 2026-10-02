import { Mail, Send } from 'lucide-react';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { buttonClass } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/config/site';

const fieldClass =
  'w-full rounded-md border border-line bg-surface/70 px-3 py-2.5 font-mono text-sm text-fg placeholder:text-subtle focus:border-accent/60 focus:outline-none disabled:cursor-not-allowed';

export function Contact() {
  return (
    <section id="contacto" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="05" title="contacto" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface/60 p-8 sm:p-10">
          <p className="font-mono text-sm text-muted">
            <span className="text-accent">$</span> echo "hola" | mail {site.email}
          </p>
          <h3 className="mt-6 text-2xl font-bold text-fg sm:text-3xl">¿Tienes un proyecto en mente?</h3>
          <p className="mt-4 max-w-md leading-relaxed text-muted">
            Estoy abierto a nuevas oportunidades y colaboraciones. Escríbeme y te respondo lo antes posible.
          </p>
          <div className="mt-8 flex flex-col items-start gap-6">
            <a href={`mailto:${site.email}`} className={buttonClass('primary')}>
              <Mail className="size-4" /> enviar email
            </a>
            <SocialLinks />
          </div>
        </div>

        {/* TODO: el formulario aún no envía nada. Al conectarlo a un servicio (p. ej. Formspree), quita `disabled` y el aviso. */}
        <form
          className="rounded-xl border border-line bg-surface/60 p-8 sm:p-10"
          onSubmit={(event) => event.preventDefault()}
        >
          <fieldset disabled className="space-y-4 opacity-60">
            <legend className="sr-only">Formulario de contacto (todavía no disponible)</legend>
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs text-muted">nombre</span>
              <input type="text" name="name" autoComplete="name" className={fieldClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs text-muted">email</span>
              <input type="email" name="email" autoComplete="email" className={fieldClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs text-muted">mensaje</span>
              <textarea name="message" rows={5} className={`${fieldClass} resize-none`} />
            </label>
            <button type="submit" className={buttonClass('ghost', 'md', 'cursor-not-allowed')}>
              <Send className="size-4" /> enviar mensaje
            </button>
          </fieldset>
          <p className="mt-4 font-mono text-xs text-subtle">
            <span className="text-amber">●</span> El formulario estará disponible pronto. Mientras tanto, escríbeme por
            email.
          </p>
        </form>
      </div>
    </section>
  );
}
