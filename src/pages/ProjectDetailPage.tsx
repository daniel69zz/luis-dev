import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { buttonClass } from '@/components/ui/Button';
import { GithubIcon } from '@/components/ui/icons';
import { site } from '@/config/site';
import { Gallery } from '@/features/projects/components/Gallery';
import { Markdown } from '@/features/projects/components/Markdown';
import { TagBadge } from '@/features/projects/components/TagBadge';
import { getProject } from '@/features/projects/projects';
import { NotFoundPage } from './NotFoundPage';

// Las fechas del frontmatter son a medianoche UTC: sin timeZone, al oeste de Greenwich saldría el día anterior
const dateFormat = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export default function ProjectDetailPage() {
  const { slug = '' } = useParams();
  const project = getProject(slug);

  if (!project) return <NotFoundPage />;

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <title>{`${project.title} — ${site.name}`}</title>
      <meta name="description" content={project.summary} />

      <Link to="/proyectos" className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-accent">
        <ArrowLeft className="size-4" /> cd ..
      </Link>

      <header className="mt-8">
        <p className="font-mono text-xs text-subtle">~/proyectos/{project.slug}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-fg sm:text-5xl">{project.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{project.summary}</p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Link key={tag.slug} to={`/proyectos?tag=${tag.slug}`}>
              <TagBadge name={tag.name} />
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className={buttonClass('ghost')}>
              <GithubIcon className="size-4" /> código
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer" className={buttonClass('primary')}>
              <ExternalLink className="size-4" /> ver demo
            </a>
          )}
          {project.date && (
            <span className="flex items-center gap-1.5 font-mono text-xs text-subtle sm:ml-auto">
              <Calendar className="size-3.5" /> {dateFormat.format(new Date(project.date))}
            </span>
          )}
        </div>
      </header>

      {project.coverUrl && (
        <div className="mt-10 overflow-hidden rounded-xl border border-line">
          <img src={project.coverUrl} alt={`Portada de ${project.title}`} className="w-full object-cover" />
        </div>
      )}

      {project.content.trim() && (
        <div className="mt-12">
          <Markdown>{project.content}</Markdown>
        </div>
      )}

      {project.images.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 font-mono text-lg font-semibold text-fg">
            <span className="text-accent">##</span> galería
          </h2>
          <Gallery images={project.images} title={project.title} />
        </section>
      )}
    </article>
  );
}
