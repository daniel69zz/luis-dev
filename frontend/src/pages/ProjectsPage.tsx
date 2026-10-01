import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { site } from '@/config/site';
import { ProjectCard } from '@/features/projects/components/ProjectCard';
import { TagBadge } from '@/features/projects/components/TagBadge';
import { useProjects, useTags } from '@/features/projects/hooks';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const PAGE_SIZE = 9;

export function ProjectsPage() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get('page')) || 1);
  const tag = params.get('tag') ?? undefined;
  const [search, setSearch] = useState(params.get('q') ?? '');
  const debouncedSearch = useDebouncedValue(search.trim());

  const { data, isPending, isFetching, error, refetch } = useProjects({
    page,
    limit: PAGE_SIZE,
    tag,
    search: debouncedSearch || undefined,
  });
  const { data: tags } = useTags();

  function updateParams(changes: Record<string, string | undefined>) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        return next;
      },
      { replace: true },
    );
  }

  // Sincroniza la búsqueda con la URL (y vuelve a la página 1)
  useEffect(() => {
    if ((params.get('q') ?? '') !== debouncedSearch) {
      updateParams({ q: debouncedSearch || undefined, page: undefined });
    }
  }, [debouncedSearch]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <title>{`Proyectos — ${site.name}`}</title>

      <header className="mb-10">
        <p className="font-mono text-sm text-muted">
          <span className="text-accent">$</span> cd ~/proyectos
        </p>
        <h1 className="mt-3 font-mono text-3xl font-bold text-fg sm:text-4xl">
          proyectos<span className="text-accent">/</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Todo lo que he construido: desde experimentos pequeños hasta aplicaciones completas.
        </p>
      </header>

      <div className="mb-8 space-y-4">
        <label className="relative block max-w-md">
          <span className="sr-only">Buscar proyectos</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="grep -i 'react'..."
            className="h-11 w-full rounded-md border border-line bg-surface/70 pl-10 pr-3 font-mono text-sm text-fg placeholder:text-subtle focus:border-accent/60 focus:outline-none"
          />
        </label>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <TagBadge name="todos" active={!tag} onClick={() => updateParams({ tag: undefined, page: undefined })} />
            {tags.map((t) => (
              <TagBadge
                key={t.slug}
                name={t.name}
                count={t.projectCount}
                active={tag === t.slug}
                onClick={() => updateParams({ tag: tag === t.slug ? undefined : t.slug, page: undefined })}
              />
            ))}
          </div>
        )}
      </div>

      {isPending && <Spinner label="buscando proyectos" />}
      {error && <ErrorState error={error} onRetry={() => refetch()} />}

      {data && (
        <>
          <p className="mb-6 font-mono text-xs text-subtle">
            {data.meta.total} resultado{data.meta.total === 1 ? '' : 's'}
            {isFetching && ' · actualizando…'}
          </p>

          {data.data.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line p-10 text-center font-mono text-sm text-muted">
              <p>
                <span className="text-danger">404</span> — ningún proyecto coincide con tu búsqueda
              </p>
            </div>
          ) : (
            <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
              {data.data.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            onChange={(next) => {
              updateParams({ page: next > 1 ? String(next) : undefined });
              window.scrollTo({ top: 0 });
            }}
          />
        </>
      )}
    </div>
  );
}
