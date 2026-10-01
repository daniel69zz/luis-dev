import { Router } from 'express';
import { listProjectsQuerySchema } from './projects.schemas.js';
import { projectsService } from './projects.service.js';

export const projectsRouter = Router();

projectsRouter.get('/', async (req, res) => {
  res.json(await projectsService.list(listProjectsQuerySchema.parse(req.query)));
});

projectsRouter.get('/:slug', async (req, res) => {
  res.json({ data: await projectsService.getBySlug(req.params.slug) });
});
