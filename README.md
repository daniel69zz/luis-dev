# luis.dev — Portafolio

Portafolio personal con estética de terminal/editor. Los proyectos se escriben como **archivos Markdown** y el backend los lee directamente: **no hay base de datos**.
El **backend** y el **frontend** son aplicaciones independientes: cada una tiene su `package.json`, su `Dockerfile` y se despliega por separado.

```
luis_dev/
├── backend/              API REST de solo lectura · Node + Express 5, sin base de datos
│   └── content/projects/ ← tus proyectos (un directorio por proyecto)
├── frontend/             SPA · React 19 + Vite + Tailwind 4 + TanStack Query
├── docker-compose.yml    stack completo en contenedores
└── package.json          scripts para levantar todo junto
```

## Arranque rápido

Requisitos: Node 22+.

```bash
npm run setup                 # instala dependencias de raíz, backend y frontend
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

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

No hay ningún paso más. Con `npm run dev` el backend recarga el contenido al guardar; en producción lo lee al arrancar, así que publicar es hacer commit y redeploy.

La carpeta es la **fuente de verdad**: borrar una carpeta borra el proyecto. Si algún `index.md` tiene errores, el servidor dice cuál: al arrancar no levanta, y en desarrollo conserva lo último que cargó bien. Las carpetas que empiezan por `_` se ignoran.

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
├── middlewares/          errores, rate limit
└── modules/
    ├── projects/         routes → service · projects.content.ts (lee content/ y lo deja en memoria)
    └── tags/
```

### Endpoints

| Método | Ruta                                              |
| ------ | ------------------------------------------------- |
| `GET`  | `/api/v1/projects?page&limit&search&tag&featured` |
| `GET`  | `/api/v1/projects/:slug`                          |
| `GET`  | `/api/v1/tags`                                    |
| `GET`  | `/media/:slug/:archivo` (imágenes de los proyectos) |
| `GET`  | `/health`                                         |

Formato de respuesta: `{ data, meta? }` si va bien, `{ error: { message, code, details? } }` si falla.

### Scripts (`backend/`)

| Script                    | Qué hace                                         |
| ------------------------- | ------------------------------------------------ |
| `npm run dev`             | servidor con recarga automática (código y contenido) |
| `npm run build` / `start` | compila a `dist/` y lo ejecuta                   |
| `npm run typecheck`       | comprueba los tipos                              |

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

- **Backend** (Railway, Render, Fly.io, un VPS…): usa `backend/Dockerfile`. La imagen incluye `content/projects` y la API lo lee al arrancar, así que publicar un proyecto nuevo es hacer commit y redeploy. No necesita base de datos ni disco persistente.
  Variables: `PUBLIC_URL` (su URL pública), `CORS_ORIGINS` (la URL del frontend) y `TRUST_PROXY=1` si va detrás de un proxy.
- **Frontend** (Vercel, Netlify, Cloudflare Pages o `frontend/Dockerfile` con nginx): define `VITE_API_URL` **en el build** y el fallback de SPA a `index.html`.

Para probar todo en contenedores:

```bash
docker compose up -d --build                      # web en :8080, API en :4000
FRONTEND_PORT=3000 docker compose up -d --build   # si el 8080 está ocupado
```

## Escalabilidad: qué está preparado y siguientes pasos

- **API versionada** (`/api/v1`): puedes sacar una `v2` sin romper clientes.
- **Módulos por dominio**: para añadir blog, experiencia o un formulario de contacto, crea `src/modules/<nombre>/` y móntalo en `routes.ts`. En el frontend, `src/features/<nombre>/`. Un blog puede reutilizar el mismo patrón de carpeta Markdown leída al arrancar.
- **Sin estado**: todo el contenido va dentro de la imagen, así que se pueden levantar varias instancias del backend sin coordinar nada. Las imágenes llevan el hash en la URL y se cachean para siempre; si pesan, basta poner un CDN delante.
- **Paginación y filtros** en las consultas de proyectos. Se resuelven en memoria, suficiente para cientos de proyectos.
- Siguientes pasos: tests (Vitest + Supertest), CI, redimensionar imágenes con `sharp` al cargar, búsqueda que ignore acentos, SEO con prerender/SSR.
