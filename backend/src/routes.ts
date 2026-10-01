import { Router } from 'express';
import { projectsRouter } from './modules/projects/projects.routes.js';
import { tagsRouter } from './modules/tags/tags.routes.js';

/**
 * API v1. Para añadir un módulo nuevo (blog, experiencia, contacto...):
 * crea src/modules/<nombre>/ y móntalo aquí.
 */
export const apiV1Router = Router();

apiV1Router.use('/projects', projectsRouter);
apiV1Router.use('/tags', tagsRouter);
