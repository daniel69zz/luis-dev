/**
 * Sincroniza la base de datos con la carpeta de contenido:
 *
 *   content/projects/
 *   └── mi-proyecto/          ← el nombre de la carpeta es el slug (URL)
 *       ├── index.md          ← frontmatter YAML + descripción en Markdown
 *       ├── cover.png         ← portada (opcional)
 *       └── gallery/          ← galería (opcional), ordenada por nombre de archivo
 *
 * La carpeta es la fuente de verdad: crea, actualiza y borra proyectos
 * (e imágenes) para que la base de datos quede igual que el contenido.
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { prisma } from '../../lib/prisma.js';
import { storage } from '../../lib/storage/index.js';
import { slugify } from '../../utils/slugify.js';
import { projectFrontmatterSchema, SLUG_REGEX, type ProjectFrontmatter } from './projects.schemas.js';

const IMAGE_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
};
const MAX_IMAGE_MB = 10;

interface LocalImage {
  key: string;
  data: Buffer;
  contentType: string;
}

interface LocalProject {
  slug: string;
  meta: ProjectFrontmatter;
  content: string;
  cover: LocalImage | null;
  gallery: LocalImage[];
}

export interface SyncResult {
  synced: { slug: string; images: number }[];
  removed: string[];
}

// Carpetas/archivos que empiezan por "_" o "." se ignoran (plantillas, .DS_Store...)
const isIgnored = (name: string) => name.startsWith('_') || name.startsWith('.');

function splitFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error('index.md debe empezar con un bloque de frontmatter (--- ... ---)');
  return { data: parseYaml(match[1] ?? '') ?? {}, body: (match[2] ?? '').trim() };
}

async function loadImage(filePath: string, slug: string): Promise<LocalImage> {
  const name = path.basename(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const contentType = IMAGE_TYPES[extension];
  if (!contentType) throw new Error(`${name}: formato no soportado (usa png, jpg, webp, gif o avif)`);

  const data = await readFile(filePath);
  if (data.length > MAX_IMAGE_MB * 1024 * 1024) throw new Error(`${name}: supera ${MAX_IMAGE_MB} MB`);

  // El hash en el nombre hace que al cambiar una imagen se invalide la caché del navegador
  const hash = createHash('sha256').update(data).digest('hex').slice(0, 16);
  return { data, contentType, key: `projects/${slug}/${hash}${extension === '.jpeg' ? '.jpg' : extension}` };
}

async function loadProject(dir: string, slug: string): Promise<LocalProject> {
  if (!SLUG_REGEX.test(slug)) {
    throw new Error('el nombre de la carpeta es la URL: usa solo minúsculas, números y guiones');
  }

  const raw = await readFile(path.join(dir, 'index.md'), 'utf8').catch(() => {
    throw new Error('falta el archivo index.md');
  });
  const { data, body } = splitFrontmatter(raw);
  const parsed = projectFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => `${i.path.join('.') || 'frontmatter'}: ${i.message}`).join('; '));
  }

  const entries = await readdir(dir, { withFileTypes: true });
  const coverEntry = entries.find((entry) => entry.isFile() && /^cover\.[a-z0-9]+$/i.test(entry.name));
  const cover = coverEntry ? await loadImage(path.join(dir, coverEntry.name), slug) : null;

  const gallery: LocalImage[] = [];
  if (entries.some((entry) => entry.isDirectory() && entry.name === 'gallery')) {
    const names = (await readdir(path.join(dir, 'gallery')))
      .filter((name) => !isIgnored(name))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    for (const name of names) gallery.push(await loadImage(path.join(dir, 'gallery', name), slug));
  }

  return { slug, meta: parsed.data, content: body, cover, gallery };
}

/** Crea los tags que no existan y devuelve sus ids (deduplicados por slug). */
async function upsertTags(names: string[]) {
  const bySlug = new Map<string, string>();
  for (const name of names) {
    const slug = slugify(name);
    if (slug && !bySlug.has(slug)) bySlug.set(slug, name);
  }
  return prisma.$transaction(
    [...bySlug].map(([slug, name]) =>
      prisma.tag.upsert({ where: { slug }, create: { slug, name }, update: { name }, select: { id: true } }),
    ),
  );
}

async function deleteFiles(keys: (string | null)[]) {
  const results = await Promise.allSettled(keys.filter((key) => key !== null).map((key) => storage.delete(key)));
  for (const result of results) {
    if (result.status === 'rejected') console.warn('No se pudo borrar un archivo del storage:', result.reason);
  }
}

async function upsertProject({ slug, meta, content, cover, gallery }: LocalProject) {
  const existing = await prisma.project.findUnique({
    where: { slug },
    select: { coverKey: true, images: { select: { key: true } } },
  });

  const images = cover ? [cover, ...gallery] : gallery;
  for (const image of images) await storage.put(image.key, image.data, image.contentType);

  const tags = await upsertTags(meta.tags);
  const fields = {
    title: meta.title,
    summary: meta.summary,
    content,
    repoUrl: meta.repo ?? null,
    demoUrl: meta.demo ?? null,
    featured: meta.featured,
    published: meta.published,
    sortOrder: meta.order,
    coverKey: cover?.key ?? null,
    ...(meta.date && { createdAt: meta.date }),
  };

  await prisma.$transaction(async (tx) => {
    const { id } = await tx.project.upsert({
      where: { slug },
      create: { slug, ...fields, tags: { connect: tags } },
      update: { ...fields, tags: { set: tags } },
      select: { id: true },
    });
    await tx.projectImage.deleteMany({ where: { projectId: id } });
    await tx.projectImage.createMany({
      data: gallery.map((image, index) => ({ projectId: id, key: image.key, sortOrder: index })),
    });
  });

  // Imágenes que el proyecto tenía antes y ya no usa
  const inUse = new Set(images.map((image) => image.key));
  const previous = existing ? [existing.coverKey, ...existing.images.map((image) => image.key)] : [];
  await deleteFiles(previous.filter((key) => key !== null && !inUse.has(key)));

  return images.length;
}

export async function syncProjects(contentDir: string): Promise<SyncResult> {
  const root = path.resolve(contentDir);
  if (!(await stat(root).catch(() => null))?.isDirectory()) {
    throw new Error(`No existe la carpeta de contenido: ${root}`);
  }

  // 1. Leer y validar todo antes de tocar la BD: si algo está mal, no se aplica nada.
  const slugs = (await readdir(root, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && !isIgnored(entry.name))
    .map((entry) => entry.name)
    .sort();

  const projects: LocalProject[] = [];
  const errors: string[] = [];
  for (const slug of slugs) {
    try {
      projects.push(await loadProject(path.join(root, slug), slug));
    } catch (error) {
      errors.push(`  ${slug}/ → ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (errors.length) throw new Error(`Contenido inválido, no se aplicó ningún cambio:\n${errors.join('\n')}`);

  // 2. Crear / actualizar
  const synced: SyncResult['synced'] = [];
  for (const project of projects) {
    synced.push({ slug: project.slug, images: await upsertProject(project) });
  }

  // 3. Borrar los proyectos cuya carpeta ya no existe
  const stale = await prisma.project.findMany({
    where: { slug: { notIn: projects.map((project) => project.slug) } },
    select: { id: true, slug: true, coverKey: true, images: { select: { key: true } } },
  });
  for (const project of stale) {
    await prisma.project.delete({ where: { id: project.id } });
    await deleteFiles([project.coverKey, ...project.images.map((image) => image.key)]);
  }

  // 4. Tags que ya no usa ningún proyecto
  await prisma.tag.deleteMany({ where: { projects: { none: {} } } });

  return { synced, removed: stale.map((project) => project.slug) };
}
