---
title: Portfolio Full Stack
summary: Este mismo portafolio. API REST en Node/Express + PostgreSQL y un frontend en React, desplegados por separado.
tags: [TypeScript, React, Node.js, PostgreSQL]
featured: true
order: 0
---

## Qué es

Mi portafolio personal, construido como dos aplicaciones independientes que se comunican por una API REST versionada. Los proyectos se escriben como archivos Markdown y se sincronizan con la base de datos.

## Stack

- **Backend:** Node.js, Express 5, Prisma, PostgreSQL
- **Frontend:** React, Vite, TanStack Query, Tailwind CSS

## Retos

```ts
// Storage desacoplado: hoy disco local, mañana S3
export interface StorageProvider {
  put(key: string, data: Buffer, contentType: string): Promise<void>;
  delete(key: string): Promise<void>;
  getPublicUrl(key: string): string;
}
```
