import { env } from '../../config/env.js';
import { LocalStorage } from './local.storage.js';
import type { StorageProvider } from './storage.types.js';

export type { StorageProvider } from './storage.types.js';

function createStorage(): StorageProvider {
  switch (env.STORAGE_DRIVER) {
    case 'local':
      return new LocalStorage(env.UPLOAD_DIR, env.PUBLIC_URL);
    // case 's3': return new S3Storage(...)
  }
}

export const storage = createStorage();

/** Directorio servido estáticamente en /uploads (solo aplica al driver local). */
export const localUploadsDir = storage instanceof LocalStorage ? storage.rootDir : null;
