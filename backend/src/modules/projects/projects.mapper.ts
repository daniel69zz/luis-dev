import type { Prisma } from '../../generated/prisma/client.js';
import { storage } from '../../lib/storage/index.js';

const tagsSelect = {
  select: { name: true, slug: true },
  orderBy: { name: 'asc' },
} satisfies Prisma.Project$tagsArgs;

export const projectSummaryArgs = {
  omit: { content: true },
  include: { tags: tagsSelect },
} satisfies Prisma.ProjectDefaultArgs;

export const projectDetailArgs = {
  include: {
    tags: tagsSelect,
    images: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
  },
} satisfies Prisma.ProjectDefaultArgs;

type ProjectSummaryRecord = Prisma.ProjectGetPayload<typeof projectSummaryArgs>;
type ProjectDetailRecord = Prisma.ProjectGetPayload<typeof projectDetailArgs>;

const urlOrNull = (key: string | null) => (key ? storage.getPublicUrl(key) : null);

export function toProjectSummary(project: ProjectSummaryRecord) {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    coverUrl: urlOrNull(project.coverKey),
    repoUrl: project.repoUrl,
    demoUrl: project.demoUrl,
    featured: project.featured,
    tags: project.tags,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export function toProjectDetail(project: ProjectDetailRecord) {
  return {
    ...toProjectSummary(project),
    content: project.content,
    images: project.images.map((image) => ({
      id: image.id,
      url: storage.getPublicUrl(image.key),
      alt: image.alt,
      sortOrder: image.sortOrder,
    })),
  };
}

export type ProjectSummaryDto = ReturnType<typeof toProjectSummary>;
export type ProjectDetailDto = ReturnType<typeof toProjectDetail>;
