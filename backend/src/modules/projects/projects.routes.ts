import { Router } from 'express';
import { listProjectsQuerySchema } from './projects.schemas.js';
import { projectsService } from './projects.service.js';

export const projectsRouter = Router();

projectsRouter.get('/', (req, res) => {
  res.json(projectsService.list(listProjectsQuerySchema.parse(req.query)));
});

projectsRouter.get('/:slug', (req, res) => {
  res.json({ data: projectsService.getBySlug(req.params.slug) });
});
