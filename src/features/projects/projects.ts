import { projects } from 'virtual:projects';
import type { Paginated, Project, ProjectListParams, TagWithCount } from './types';

function matches(project: Project, { search, tag, featured }: ProjectListParams) {
  if (featured !== undefined && project.featured !== featured) return false;
  if (tag && !project.tags.some(({ slug }) => slug === tag)) return false;
  if (search) {
    const term = search.toLowerCase();
    const haystack = [project.title, project.summary, ...project.tags.map(({ name }) => name)];
    if (!haystack.some((text) => text.toLowerCase().includes(term))) return false;
  }
  return true;
}

/** Los proyectos ya vienen ordenados: destacados → order → más recientes. */
export function listProjects(params: ProjectListParams = {}): Paginated<Project> {
  const { page = 1, limit = 12 } = params;
  const items = projects.filter((project) => matches(project, params));
  const total = items.length;

  return {
    data: items.slice((page - 1) * limit, page * limit),
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

function countTags(): TagWithCount[] {
  const tags = new Map<string, TagWithCount>();
  for (const project of projects) {
    for (const tag of project.tags) {
      const known = tags.get(tag.slug);
      if (known) known.projectCount += 1;
      else tags.set(tag.slug, { ...tag, projectCount: 1 });
    }
  }
  return [...tags.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** Todos los tags en uso, con su número de proyectos. */
export const tags = countTags();
