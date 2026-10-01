import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Spinner } from '@/components/ui/Spinner';
import { ProjectCard } from '@/features/projects/components/ProjectCard';
import { useProjects } from '@/features/projects/hooks';

export function FeaturedProjects() {
  // Los destacados salen primero por el orden del backend, así que basta con pedir los 6 primeros.
  const { data, isPending, error, refetch } = useProjects({ limit: 6 });

  return (
    <section id="proyectos" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="02" title="proyectos" />

      {isPending && <Spinner label="ls proyectos/" />}
      {error && <ErrorState error={error} onRetry={() => refetch()} />}

      {data && data.data.length === 0 && (
        <p className="font-mono text-sm text-muted">
          <span className="text-accent">$</span> ls proyectos/ <span className="text-subtle">— todavía vacío</span>
        </p>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {data.meta.total > data.data.length && (
            <div className="mt-10 flex justify-center">
              <ButtonLink to="/proyectos">
                ver los {data.meta.total} proyectos <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          )}
        </>
      )}
    </section>
  );
}
