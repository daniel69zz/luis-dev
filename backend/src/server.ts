import { createApp } from './app.js';
import { env } from './config/env.js';
import { loadContent, watchContent } from './modules/projects/projects.content.js';

try {
  const { projects } = await loadContent();
  console.log(`📁 ${projects.length} proyectos cargados de ${env.CONTENT_DIR}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
if (!env.isProduction) watchContent();

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`🚀 API escuchando en :${env.PORT} → ${env.PUBLIC_URL}/api/v1 (${env.NODE_ENV})`);
});

function shutdown(signal: string) {
  console.log(`\n${signal} recibido, cerrando...`);
  server.close(() => process.exit(0));
  // Si algo cuelga, forzamos la salida
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
