/**
 * Contrato que cualquier proveedor de almacenamiento debe cumplir.
 * Para pasar a S3 / Cloudflare R2 / Cloudinary basta con crear otra
 * implementación y registrarla en ./index.ts — el resto de la app no cambia.
 */
export interface StorageProvider {
  /** Guarda (o sobreescribe) un archivo bajo `key`, p. ej. "projects/mi-app/3f2a9c.png". */
  put(key: string, data: Buffer, contentType: string): Promise<void>;
  delete(key: string): Promise<void>;
  getPublicUrl(key: string): string;
}
