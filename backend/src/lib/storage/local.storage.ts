import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { StorageProvider } from './storage.types.js';

export class LocalStorage implements StorageProvider {
  readonly rootDir: string;

  constructor(
    rootDir: string,
    private readonly publicBaseUrl: string,
  ) {
    this.rootDir = path.resolve(rootDir);
  }

  async put(key: string, data: Buffer): Promise<void> {
    const destination = this.resolveKey(key);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, data);
  }

  async delete(key: string): Promise<void> {
    await rm(this.resolveKey(key), { force: true });
  }

  getPublicUrl(key: string): string {
    return `${this.publicBaseUrl}/uploads/${key}`;
  }

  /** Convierte una key en ruta absoluta impidiendo salir del directorio raíz. */
  private resolveKey(key: string): string {
    const resolved = path.resolve(this.rootDir, key);
    if (!resolved.startsWith(this.rootDir + path.sep)) {
      throw new Error(`Key de storage inválida: ${key}`);
    }
    return resolved;
  }
}
