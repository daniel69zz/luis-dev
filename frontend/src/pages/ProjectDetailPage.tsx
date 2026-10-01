import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { buttonClass } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { GithubIcon } from '@/components/ui/icons';
import { Spinner } from '@/components/ui/Spinner';
import { site } from '@/config/site';
import { Gallery } from '@/features/projects/components/Gallery';
import { Markdown } from '@/features/projects/components/Markdown';
import { TagBadge } from '@/features/projects/components/TagBadge';
import { useProject } from '@/features/projects/hooks';
import { ApiError } from '@/lib/api-client';
import { NotFoundPage } from './NotFoundPage';

const dateFormat = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ProjectDetailPage() {
  const { slug = '' } = useParams();
  const { data: project, isPending, error, refetch } = useProject(slug);

  if (error instanceof ApiError && error.status === 404) return <NotFoundPage />;

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link to="/proyectos" className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-accent">
        <ArrowLeft className="size-4" /> cd ..
      </Link>

      {isPending && (
        <div className="mt-10">
          <Spinner label={`cat ${slug}.md`} />
        </div>
      )}
      {error && (
        <div className="mt-10">
          <ErrorState error={error} onRetry={() => refetch()} />
        </div>
      )}

      {project && (
        <>
          <title>{`${project.title} — ${site.name}`}</title>
          <meta name="description" content={project.summary} />

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
              <span className="flex items-center gap-1.5 font-mono text-xs text-subtle sm:ml-auto">
                <Calendar className="size-3.5" /> {dateFormat.format(new Date(project.createdAt))}
              </span>
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
        </>
      )}
    </article>
  );
}
