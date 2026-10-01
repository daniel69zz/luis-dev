import { z } from 'zod';

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ─── Query de la API pública ────────────────────────────────
export const listProjectsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().trim().max(100).optional(),
  tag: z.string().trim().max(80).optional(),
  featured: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
});

// ─── Frontmatter de content/projects/<slug>/index.md ────────
const httpUrl = z.url({ protocol: /^https?$/, error: 'Debe ser una URL http(s) válida' }).max(500);

export const projectFrontmatterSchema = z.object({
  title: z.string({ error: 'es obligatorio' }).trim().min(2, 'Mínimo 2 caracteres').max(120),
  summary: z.string({ error: 'es obligatorio' }).trim().min(10, 'Mínimo 10 caracteres').max(300),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  repo: httpUrl.optional(),
  demo: httpUrl.optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  /** Menor número = aparece antes */
  order: z.number().int().min(0).default(0),
  /** Fecha del proyecto (YYYY-MM-DD). Se muestra en el detalle y desempata el orden. */
  date: z.coerce.date().optional(),
});

export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;
export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
