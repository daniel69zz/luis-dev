/**
 * Los proyectos viven en archivos, no en una base de datos ni detrás de una API:
 *
 *   content/projects/
 *   └── mi-proyecto/          ← el nombre de la carpeta es el slug (URL)
 *       ├── index.md          ← frontmatter YAML + descripción en Markdown
 *       ├── cover.png         ← portada (opcional)
 *       └── gallery/          ← galería (opcional), ordenada por nombre de archivo
 *
 * Este plugin los lee y valida al compilar y los expone como el módulo `virtual:projects`.
 * Si un index.md tiene errores, el build falla y dice cuál.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import type { Plugin } from 'vite';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

const CONTENT_DIR = 'content/projects';
const VIRTUAL_ID = 'virtual:projects';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);

const httpUrl = z.url({ protocol: /^https?$/, error: 'Debe ser una URL http(s) válida' }).max(500);

const frontmatterSchema = z.object({
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

interface LoadedProject {
  slug: string;
  meta: z.infer<typeof frontmatterSchema>;
  content: string;
  /** Rutas desde la raíz del proyecto, para que Vite las procese como assets */
  cover: string | null;
  gallery: string[];
}

// Carpetas/archivos que empiezan por "_" o "." se ignoran (plantillas, .DS_Store...)
const isIgnored = (name: string) => name.startsWith('_') || name.startsWith('.');

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function splitFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error('index.md debe empezar con un bloque de frontmatter (--- ... ---)');
  return { data: parseYaml(match[1] ?? '') ?? {}, body: (match[2] ?? '').trim() };
}

function checkImage(name: string) {
  if (!IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase())) {
    throw new Error(`${name}: formato no soportado (usa png, jpg, webp, gif o avif)`);
  }
}

async function loadProject(root: string, slug: string): Promise<LoadedProject> {
  if (!SLUG_REGEX.test(slug)) {
    throw new Error('el nombre de la carpeta es la URL: usa solo minúsculas, números y guiones');
  }

  const dir = path.join(root, slug);
  const raw = await readFile(path.join(dir, 'index.md'), 'utf8').catch(() => {
    throw new Error('falta el archivo index.md');
  });
  const { data, body } = splitFrontmatter(raw);
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => `${i.path.join('.') || 'frontmatter'}: ${i.message}`).join('; '));
  }

  const entries = await readdir(dir, { withFileTypes: true });
  const coverEntry = entries.find((entry) => entry.isFile() && /^cover\.[a-z0-9]+$/i.test(entry.name));
  if (coverEntry) checkImage(coverEntry.name);

  const gallery: string[] = [];
  if (entries.some((entry) => entry.isDirectory() && entry.name === 'gallery')) {
    const names = (await readdir(path.join(dir, 'gallery')))
      .filter((name) => !isIgnored(name))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    for (const name of names) {
      checkImage(name);
      gallery.push(`/${CONTENT_DIR}/${slug}/gallery/${name}`);
    }
  }

  return {
    slug,
    meta: parsed.data,
    content: body,
    cover: coverEntry ? `/${CONTENT_DIR}/${slug}/${coverEntry.name}` : null,
    gallery,
  };
}

async function loadProjects(root: string): Promise<LoadedProject[]> {
  if (!(await stat(root).catch(() => null))?.isDirectory()) {
    throw new Error(`No existe la carpeta de contenido: ${root}`);
  }

  const slugs = (await readdir(root, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && !isIgnored(entry.name))
    .map((entry) => entry.name)
    .sort();

  const projects: LoadedProject[] = [];
  const errors: string[] = [];
  for (const slug of slugs) {
    try {
      projects.push(await loadProject(root, slug));
    } catch (error) {
      errors.push(`  ${slug}/ → ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (errors.length) throw new Error(`Contenido inválido:\n${errors.join('\n')}`);

  // Destacados → order → más recientes
  return projects
    .filter((project) => project.meta.published)
    .sort(
      (a, b) =>
        Number(b.meta.featured) - Number(a.meta.featured) ||
        a.meta.order - b.meta.order ||
        (b.meta.date?.getTime() ?? 0) - (a.meta.date?.getTime() ?? 0),
    );
}

/** Genera el código del módulo: las imágenes son imports para que Vite les ponga hash y las optimice. */
function toModule(projects: LoadedProject[]): string {
  const imports: string[] = [];
  const image = (file: string) => {
    imports.push(`import image${imports.length} from ${JSON.stringify(file)};`);
    return `image${imports.length - 1}`;
  };

  const items = projects.map(({ slug, meta, content, cover, gallery }) => {
    const tags = new Map<string, { name: string; slug: string }>();
    for (const name of meta.tags) {
      const tagSlug = slugify(name);
      if (tagSlug && !tags.has(tagSlug)) tags.set(tagSlug, { name, slug: tagSlug });
    }

    const fields = JSON.stringify({
      slug,
      title: meta.title,
      summary: meta.summary,
      content,
      repoUrl: meta.repo ?? null,
      demoUrl: meta.demo ?? null,
      featured: meta.featured,
      tags: [...tags.values()].sort((a, b) => a.name.localeCompare(b.name)),
      date: meta.date?.toISOString() ?? null,
    });
    return `{ ...${fields}, coverUrl: ${cover ? image(cover) : 'null'}, images: [${gallery.map(image).join(', ')}] }`;
  });

  return `${imports.join('\n')}\nexport const projects = [\n${items.join(',\n')}\n];\n`;
}

export function projects(): Plugin {
  const root = path.resolve(CONTENT_DIR);

  return {
    name: 'projects',
    resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),
    async load(id) {
      if (id !== RESOLVED_ID) return;
      return toModule(await loadProjects(root));
    },
    // En desarrollo, recarga la página al crear, editar o borrar cualquier archivo de contenido
    configureServer(server) {
      server.watcher.add(root);
      server.watcher.on('all', (_event, file) => {
        if (!file.startsWith(root + path.sep)) return;
        const module = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}
