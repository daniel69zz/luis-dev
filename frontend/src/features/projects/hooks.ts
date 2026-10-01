import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { projectsApi } from './api';
import type { ProjectListParams } from './types';

export const projectKeys = {
  all: ['projects'] as const,
  list: (params: ProjectListParams) => [...projectKeys.all, 'list', params] as const,
  detail: (slug: string) => [...projectKeys.all, 'detail', slug] as const,
  tags: () => [...projectKeys.all, 'tags'] as const,
};

export function useProjects(params: ProjectListParams) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: ({ signal }) => projectsApi.list(params, signal),
    placeholderData: keepPreviousData,
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: projectKeys.detail(slug),
    queryFn: ({ signal }) => projectsApi.getBySlug(slug, signal),
  });
}

export function useTags() {
  return useQuery({
    queryKey: projectKeys.tags(),
    queryFn: ({ signal }) => projectsApi.tags(signal),
    staleTime: 5 * 60_000,
  });
}
