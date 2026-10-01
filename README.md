# luis.dev — Portafolio

Portafolio personal con estética de terminal/editor. Los proyectos se escriben como **archivos Markdown** y se cargan en la base de datos con un comando.
El **backend** y el **frontend** son aplicaciones independientes: cada una tiene su `package.json`, su `Dockerfile` y se despliega por separado.

```
luis_dev/
├── backend/              API REST de solo lectura · Node + Express 5 + Prisma 7 + PostgreSQL
│   └── content/projects/ ← tus proyectos (un directorio por proyecto)
├── frontend/             SPA · React 19 + Vite + Tailwind 4 + TanStack Query
├── docker-compose.yml    PostgreSQL para desarrollo / stack completo
└── package.json          scripts para levantar todo junto
```

## Arranque rápido

Requisitos: Node 22+ y Docker.

```bash
npm run setup                 # instala dependencias de raíz, backend y frontend
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

npm run db:up                 # PostgreSQL en Docker (puerto 5433)
npm --prefix backend run db:deploy   # crea las tablas
npm run sync                  # carga backend/content/projects en la BD

npm run dev                   # API en :4000 y web en :5173
```

- Sitio: <http://localhost:5173>
- API: <http://localhost:4000/api/v1>

## Añadir un proyecto

1. Copia `backend/content/projects/_plantilla/` y renómbrala. **El nombre de la carpeta es la URL**: `mi-app/` → `/proyectos/mi-app` (solo minúsculas, números y guiones).
2. Edita `index.md`:

   ```md
   ---
   title: Mi App                       # obligatorio
   summary: Qué es, en una o dos frases. # obligatorio (10-300 caracteres)
   tags: [React, Node.js]
   repo: https://github.com/tu-usuario/mi-app
   demo: https://mi-app.com
   featured: true                      # aparece primero, con estrella
   published: true                     # false = borrador, no se muestra
   order: 0                            # menor = antes
   date: 2026-01-15                    # se muestra en el detalle
   ---

   ## Descripción en Markdown
   ...
   ```

3. Imágenes (opcionales), en la misma carpeta:
   - `cover.png` / `cover.jpg` / `cover.webp` → portada
   - `gallery/01.png`, `gallery/02.jpg`… → galería, en orden alfabético
4. `npm run sync`

La carpeta es la **fuente de verdad**: el sync crea, actualiza y **borra** proyectos e imágenes para que la base de datos quede igual que `content/projects/`. Si algún `index.md` tiene errores, te dice cuál y no aplica ningún cambio. Las carpetas que empiezan por `_` se ignoran.

## Personalizar

| Qué                              | Dónde                                              |
| -------------------------------- | -------------------------------------------------- |
| Nombre, bio, redes, email, stack | `frontend/src/config/site.ts`                      |
| Colores y tipografías            | tokens `@theme` en `frontend/src/styles/index.css` |
| Proyectos                        | `backend/content/projects/`                        |
| Favicon                          | `frontend/public/favicon.svg`                      |

## Backend

```
backend/src/
├── server.ts             arranque + apagado limpio
├── app.ts                middlewares globales (helmet, CORS, rate limit, estáticos)
├── routes.ts             monta los módulos bajo /api/v1
├── config/env.ts         variables de entorno validadas con Zod
├── lib/
│   ├── prisma.ts         cliente de base de datos
│   └── storage/          dónde se publican las imágenes (local hoy, S3/R2 mañana)
├── middlewares/          errores, rate limit
├── modules/
│   ├── projects/         routes → service → mapper (DTO) · projects.sync.ts (content → BD)
│   └── tags/
└── scripts/sync-projects.ts
```

### Endpoints

| Método | Ruta                                              |
| ------ | ------------------------------------------------- |
| `GET`  | `/api/v1/projects?page&limit&search&tag&featured` |
| `GET`  | `/api/v1/projects/:slug`                          |
| `GET`  | `/api/v1/tags`                                    |
| `GET`  | `/health`                                         |

Formato de respuesta: `{ data, meta? }` si va bien, `{ error: { message, code, details? } }` si falla.

### Scripts (`backend/`)

| Script                  | Qué hace                                               |
| ----------------------- | ------------------------------------------------------ |
| `npm run dev`           | servidor con recarga automática                        |
| `npm run build` / `start` | compila a `dist/` y lo ejecuta                       |
| `npm run projects:sync` | carga `content/projects` (= `npm run sync` en la raíz) |
| `npm run db:migrate`    | crea una migración tras cambiar `prisma/schema.prisma` |
| `npm run db:deploy`     | aplica migraciones pendientes                          |
| `npm run db:studio`     | explorador visual de la base de datos                  |

## Frontend

```
frontend/src/
├── main.tsx, router.tsx   rutas; el detalle se carga bajo demanda
├── config/site.ts         tus datos personales
├── lib/api-client.ts      fetch tipado y errores de la API
├── features/projects/     api + hooks de React Query + componentes
├── components/            layout y UI reutilizable
└── pages/
```

## Despliegue

Cada app se despliega por separado:

- **Backend** (Railway, Render, Fly.io, un VPS…): usa `backend/Dockerfile`. Al arrancar aplica las migraciones, **sincroniza `content/projects`** y levanta la API, así que publicar un proyecto nuevo es hacer commit y redeploy.
  Variables: `DATABASE_URL`, `PUBLIC_URL` (su URL pública), `CORS_ORIGINS` (la URL del frontend) y `TRUST_PROXY=1` si va detrás de un proxy.
- **Frontend** (Vercel, Netlify, Cloudflare Pages o `frontend/Dockerfile` con nginx): define `VITE_API_URL` **en el build** y el fallback de SPA a `index.html`.

Para probar todo en contenedores:

```bash
docker compose up -d --build                      # web en :8080, API en :4000
FRONTEND_PORT=3000 docker compose up -d --build   # si el 8080 está ocupado
```

## Escalabilidad: qué está preparado y siguientes pasos

- **API versionada** (`/api/v1`): puedes sacar una `v2` sin romper clientes.
- **Módulos por dominio**: para añadir blog, experiencia o un formulario de contacto, crea `src/modules/<nombre>/` y móntalo en `routes.ts`. En el frontend, `src/features/<nombre>/`. Un blog puede reutilizar el mismo patrón de carpeta Markdown + sync.
- **Storage desacoplado**: la BD guarda la *key* de cada imagen, no la URL. Antes de levantar varias instancias del backend, implementa un `StorageProvider` para S3 / Cloudflare R2 en `src/lib/storage/` y ejecuta el sync como paso de release (no en cada instancia).
- **Paginación, filtros e índices** en las consultas de proyectos.
- Siguientes pasos: tests (Vitest + Supertest), CI, redimensionar imágenes con `sharp` durante el sync, búsqueda que ignore acentos (`unaccent`), SEO con prerender/SSR.
