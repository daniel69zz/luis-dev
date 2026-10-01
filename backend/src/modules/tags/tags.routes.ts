import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';

export const tagsRouter = Router();

/** Tags que tienen al menos un proyecto publicado, con su conteo. */
tagsRouter.get('/', async (_req, res) => {
  const tags = await prisma.tag.findMany({
    where: { projects: { some: { published: true } } },
    select: {
      name: true,
      slug: true,
      _count: { select: { projects: { where: { published: true } } } },
    },
    orderBy: { name: 'asc' },
  });

  res.json({
    data: tags.map(({ _count, ...tag }) => ({ ...tag, projectCount: _count.projects })),
  });
});
