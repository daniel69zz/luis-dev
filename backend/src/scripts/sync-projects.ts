/**
 * Carga content/projects/ en la base de datos.
 *
 *   Desarrollo:  npm run projects:sync
 *   Producción:  node dist/scripts/sync-projects.js  (se ejecuta al arrancar el contenedor)
 */
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { syncProjects } from '../modules/projects/projects.sync.js';

try {
  const { synced, removed } = await syncProjects(env.CONTENT_DIR);

  for (const { slug, images } of synced) console.log(`✔ ${slug}${images ? ` (${images} imágenes)` : ''}`);
  for (const slug of removed) console.log(`✖ ${slug} — eliminado (su carpeta ya no existe)`);
  console.log(`\n${synced.length} proyectos sincronizados, ${removed.length} eliminados.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
