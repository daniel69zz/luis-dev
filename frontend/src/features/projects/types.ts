export interface Tag {
  name: string;
  slug: string;
}

export interface TagWithCount extends Tag {
  projectCount: number;
}

export interface ProjectSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverUrl: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

export interface ProjectDetail extends ProjectSummary {
  content: string;
  images: ProjectImage[];
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
