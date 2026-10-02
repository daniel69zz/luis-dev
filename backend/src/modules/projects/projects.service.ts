import { HttpError } from '../../utils/http-error.js';
import { getContent, type Project } from './projects.content.js';
import type { ListProjectsQuery } from './projects.schemas.js';

function toProjectSummary({ content: _content, images: _images, sortOrder: _sortOrder, ...summary }: Project) {
  return summary;
}

function toProjectDetail({ sortOrder: _sortOrder, ...detail }: Project) {
  return detail;
}

function matches(project: Project, { search, tag, featured }: ListProjectsQuery) {
  if (featured !== undefined && project.featured !== featured) return false;
  if (tag && !project.tags.some(({ slug }) => slug === tag)) return false;
  if (search) {
    const term = search.toLowerCase();
    const haystack = [project.title, project.summary, ...project.tags.map(({ name }) => name)];
    if (!haystack.some((text) => text.toLowerCase().includes(term))) return false;
  }
  return true;
}

export const projectsService = {
  list(query: ListProjectsQuery) {
    const { page, limit } = query;
    const items = getContent().projects.filter((project) => matches(project, query));
    const total = items.length;

    return {
      data: items.slice((page - 1) * limit, page * limit).map(toProjectSummary),
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  },

  getBySlug(slug: string) {
    const project = getContent().projects.find((candidate) => candidate.slug === slug);
    if (!project) throw HttpError.notFound('Proyecto no encontrado');
    return toProjectDetail(project);
  },
};
