import type { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import { HttpError } from '../../utils/http-error.js';
import { projectDetailArgs, projectSummaryArgs, toProjectDetail, toProjectSummary } from './projects.mapper.js';
import type { ListProjectsQuery } from './projects.schemas.js';

const DEFAULT_ORDER: Prisma.ProjectOrderByWithRelationInput[] = [
  { featured: 'desc' },
  { sortOrder: 'asc' },
  { createdAt: 'desc' },
];

function buildWhere({ search, tag, featured }: ListProjectsQuery): Prisma.ProjectWhereInput {
  return {
    published: true,
    ...(featured !== undefined && { featured }),
    ...(tag && { tags: { some: { slug: tag } } }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { tags: { some: { name: { contains: search, mode: 'insensitive' } } } },
      ],
    }),
  };
}

export const projectsService = {
  async list(query: ListProjectsQuery) {
    const where = buildWhere(query);
    const { page, limit } = query;

    const [items, total] = await prisma.$transaction([
      prisma.project.findMany({
        ...projectSummaryArgs,
        where,
        orderBy: DEFAULT_ORDER,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      data: items.map(toProjectSummary),
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  },

  async getBySlug(slug: string) {
    const project = await prisma.project.findFirst({ ...projectDetailArgs, where: { slug, published: true } });
    if (!project) throw HttpError.notFound('Proyecto no encontrado');
    return toProjectDetail(project);
  },
};
