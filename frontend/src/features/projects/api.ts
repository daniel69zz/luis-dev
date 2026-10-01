import { api } from '@/lib/api-client';
import type { Paginated, ProjectDetail, ProjectListParams, ProjectSummary, TagWithCount } from './types';

type Data<T> = { data: T };

export const projectsApi = {
  list: (params: ProjectListParams, signal?: AbortSignal) =>
    api<Paginated<ProjectSummary>>('/projects', { query: { ...params }, signal }),

  getBySlug: (slug: string, signal?: AbortSignal) =>
    api<Data<ProjectDetail>>(`/projects/${encodeURIComponent(slug)}`, { signal }).then((r) => r.data),

  tags: (signal?: AbortSignal) => api<Data<TagWithCount[]>>('/tags', { signal }).then((r) => r.data),
};
