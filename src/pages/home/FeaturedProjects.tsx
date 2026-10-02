import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/features/projects/components/ProjectCard';
import { listProjects } from '@/features/projects/projects';

export function FeaturedProjects() {
  // Los destacados salen primero en el orden por defecto, así que basta con tomar los 6 primeros.
  const { data, meta } = listProjects({ limit: 6 });

  return (
    <section id="proyectos" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="02" title="proyectos" />

      {data.length === 0 ? (
        <p className="font-mono text-sm text-muted">
          <span className="text-accent">$</span> ls proyectos/ <span className="text-subtle">— todavía vacío</span>
        </p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          {meta.total > data.length && (
            <div className="mt-10 flex justify-center">
              <ButtonLink to="/proyectos">
                ver los {meta.total} proyectos <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          )}
        </>
      )}
    </section>
  );
}
