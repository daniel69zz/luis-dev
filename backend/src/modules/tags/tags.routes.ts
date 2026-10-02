import { Router } from 'express';
import { getContent } from '../projects/projects.content.js';

export const tagsRouter = Router();

/** Tags que tienen al menos un proyecto publicado, con su conteo. */
tagsRouter.get('/', (_req, res) => {
  res.json({ data: getContent().tags });
});
