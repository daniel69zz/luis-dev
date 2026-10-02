import { ArrowUpRight, ExternalLink, Star } from 'lucide-react';
import { Link } from 'react-router';
import { GithubIcon } from '@/components/ui/icons';
import type { Project } from '../types';
import { ProjectCover } from './ProjectCover';
import { TagBadge } from './TagBadge';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface/70 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5">
      {/* Pestaña tipo editor */}
      <div className="flex items-center justify-between border-b border-line bg-surface-2/60 px-3 py-2 font-mono text-xs text-muted">
        <span className="truncate">
          <span className="text-accent">●</span> {project.slug}.md
        </span>
        {project.featured && (
          <span className="flex items-center gap-1 text-amber">
            <Star className="size-3 fill-current" /> destacado
          </span>
        )}
      </div>

      <div className="aspect-video overflow-hidden border-b border-line">
        <ProjectCover
          title={project.title}
          slug={project.slug}
          coverUrl={project.coverUrl}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-mono text-lg font-semibold text-fg transition-colors group-hover:text-accent">
          <Link to={`/proyectos/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{project.summary}</p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.tags.map((tag) => (
            <TagBadge key={tag.slug} name={tag.name} />
          ))}
        </div>

        <div className="relative z-10 flex items-center gap-3 border-t border-line pt-3 text-muted">
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" aria-label="Repositorio" className="hover:text-accent">
              <GithubIcon className="size-4" />
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer" aria-label="Demo" className="hover:text-accent">
              <ExternalLink className="size-4" />
            </a>
          )}
          <span className="ml-auto flex items-center gap-1 font-mono text-xs transition-colors group-hover:text-accent">
            ver más <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
