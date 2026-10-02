/**
 * Los proyectos viven en archivos, no en una base de datos:
 *
 *   content/projects/
 *   └── mi-proyecto/          ← el nombre de la carpeta es el slug (URL)
 *       ├── index.md          ← frontmatter YAML + descripción en Markdown
 *       ├── cover.png         ← portada (opcional)
 *       └── gallery/          ← galería (opcional), ordenada por nombre de archivo
 *
 * La carpeta se lee y valida al arrancar y queda en memoria; la API responde desde ahí.
 */
import { createHash } from 'node:crypto';
import { watch } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { env } from '../../config/env.js';
import { slugify } from '../../utils/slugify.js';
import { projectFrontmatterSchema, SLUG_REGEX } from './projects.schemas.js';

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);
const MAX_IMAGE_MB = 10;

export interface Tag {
  name: string;
  slug: string;
}

export interface ProjectImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** Descripción larga en Markdown */
  content: string;
  coverUrl: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
  sortOrder: number;
  tags: Tag[];
  images: ProjectImage[];
  createdAt: Date;
  updatedAt: Date;
}

interface Content {
  /** Solo los publicados, ya ordenados: destacados → order → más recientes */
  projects: Project[];
  tags: (Tag & { projectCount: number })[];
  /** Clave pública de cada imagen ("mi-proyecto/3f2a9c.png") → ruta en disco */
  media: Map<string, string>;
}

let current: Content = { projects: [], tags: [], media: new Map() };

export const getContent = () => current;

// Carpetas/archivos que empiezan por "_" o "." se ignoran (plantillas, .DS_Store...)
const isIgnored = (name: string) => name.startsWith('_') || name.startsWith('.');

function splitFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error('index.md debe empezar con un bloque de frontmatter (--- ... ---)');
  return { data: parseYaml(match[1] ?? '') ?? {}, body: (match[2] ?? '').trim() };
}

async function loadImage(filePath: string, slug: string, media: Map<string, string>): Promise<string> {
  const name = path.basename(filePath);
  const extension = path.extname(filePath).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(extension)) {
    throw new Error(`${name}: formato no soportado (usa png, jpg, webp, gif o avif)`);
  }

  const data = await readFile(filePath);
  if (data.length > MAX_IMAGE_MB * 1024 * 1024) throw new Error(`${name}: supera ${MAX_IMAGE_MB} MB`);

  // El hash en el nombre hace que al cambiar una imagen se invalide la caché del navegador
  const hash = createHash('sha256').update(data).digest('hex').slice(0, 16);
  const key = `${slug}/${hash}${extension}`;
  media.set(key, filePath);
  return key;
}

const mediaUrl = (key: string) => `${env.PUBLIC_URL}/media/${key}`;

/** Devuelve null si el proyecto es un borrador (published: false). */
async function loadProject(dir: string, slug: string, media: Map<string, string>): Promise<Project | null> {
  if (!SLUG_REGEX.test(slug)) {
    throw new Error('el nombre de la carpeta es la URL: usa solo minúsculas, números y guiones');
  }

  const indexPath = path.join(dir, 'index.md');
  const raw = await readFile(indexPath, 'utf8').catch(() => {
    throw new Error('falta el archivo index.md');
  });
  const { data, body } = splitFrontmatter(raw);
  const parsed = projectFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => `${i.path.join('.') || 'frontmatter'}: ${i.message}`).join('; '));
  }
  const meta = parsed.data;

  // Las imágenes se validan también en los borradores, pero solo se publican las de los publicados
  const ownMedia = new Map<string, string>();
  const entries = await readdir(dir, { withFileTypes: true });
  const coverEntry = entries.find((entry) => entry.isFile() && /^cover\.[a-z0-9]+$/i.test(entry.name));
  const coverKey = coverEntry ? await loadImage(path.join(dir, coverEntry.name), slug, ownMedia) : null;

  const galleryKeys: string[] = [];
  if (entries.some((entry) => entry.isDirectory() && entry.name === 'gallery')) {
    const names = (await readdir(path.join(dir, 'gallery')))
      .filter((name) => !isIgnored(name))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    for (const name of names) galleryKeys.push(await loadImage(path.join(dir, 'gallery', name), slug, ownMedia));
  }

  if (!meta.published) return null;
  for (const [key, filePath] of ownMedia) media.set(key, filePath);

  const tags = new Map<string, Tag>();
  for (const name of meta.tags) {
    const tagSlug = slugify(name);
    if (tagSlug && !tags.has(tagSlug)) tags.set(tagSlug, { name, slug: tagSlug });
  }

  const updatedAt = (await stat(indexPath)).mtime;
  return {
    id: slug,
    slug,
    title: meta.title,
    summary: meta.summary,
    content: body,
    coverUrl: coverKey && mediaUrl(coverKey),
    repoUrl: meta.repo ?? null,
    demoUrl: meta.demo ?? null,
    featured: meta.featured,
    sortOrder: meta.order,
    tags: [...tags.values()].sort((a, b) => a.name.localeCompare(b.name)),
    images: galleryKeys.map((key, index) => ({ id: key, url: mediaUrl(key), alt: null, sortOrder: index })),
    createdAt: meta.date ?? updatedAt,
    updatedAt,
  };
}

async function readContent(contentDir: string): Promise<Content> {
  const root = path.resolve(contentDir);
  if (!(await stat(root).catch(() => null))?.isDirectory()) {
    throw new Error(`No existe la carpeta de contenido: ${root}`);
  }

  const slugs = (await readdir(root, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && !isIgnored(entry.name))
    .map((entry) => entry.name)
    .sort();

  const projects: Project[] = [];
  const media = new Map<string, string>();
  const errors: string[] = [];
  for (const slug of slugs) {
    try {
      const project = await loadProject(path.join(root, slug), slug, media);
      if (project) projects.push(project);
    } catch (error) {
      errors.push(`  ${slug}/ → ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (errors.length) throw new Error(`Contenido inválido:\n${errors.join('\n')}`);

  projects.sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) ||
      a.sortOrder - b.sortOrder ||
      b.createdAt.getTime() - a.createdAt.getTime(),
  );

  const tags = new Map<string, Tag & { projectCount: number }>();
  for (const project of projects) {
    for (const tag of project.tags) {
      const known = tags.get(tag.slug);
      if (known) known.projectCount += 1;
      else tags.set(tag.slug, { ...tag, projectCount: 1 });
    }
  }

  return { projects, tags: [...tags.values()].sort((a, b) => a.name.localeCompare(b.name)), media };
}

/** Lee y valida la carpeta de contenido. Si algo está mal lanza un error y no cambia lo que ya estaba cargado. */
export async function loadContent(contentDir = env.CONTENT_DIR) {
  current = await readContent(contentDir);
  return current;
}

/** Recarga el contenido cuando cambia un archivo, para no reiniciar el servidor mientras escribes. */
export function watchContent(contentDir = env.CONTENT_DIR) {
  let timer: NodeJS.Timeout | undefined;
  watch(path.resolve(contentDir), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      loadContent(contentDir)
        .then(({ projects }) => console.log(`↻ contenido recargado (${projects.length} proyectos)`))
        .catch((error) => console.error(error instanceof Error ? error.message : error));
    }, 200);
  });
}
