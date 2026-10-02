export interface Tag {
  name: string;
  slug: string;
}

export interface TagWithCount extends Tag {
  projectCount: number;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  /** Descripción larga en Markdown */
  content: string;
  coverUrl: string | null;
  /** URLs de la galería, en orden */
  images: string[];
  repoUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
  tags: Tag[];
  /** Fecha ISO, o null si el proyecto no la declara */
  date: string | null;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

export interface ProjectListParams {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  featured?: boolean;
}
