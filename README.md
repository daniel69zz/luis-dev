# luis.dev — Portafolio

Portafolio personal con estética de terminal/editor. Es un **sitio estático**: no hay backend ni base de datos. Los proyectos se escriben como **archivos Markdown** y se leen al compilar.

```
luis_dev/
├── content/projects/        ← tus proyectos (un directorio por proyecto)
├── src/                     SPA · React 19 + Vite + Tailwind 4
├── vite-plugin-projects.ts  lee y valida content/projects al compilar
└── public/
```

## Arranque rápido

Requisitos: Node 22+.

```bash
npm install
npm run dev        # http://localhost:5173
```

## Añadir un proyecto

1. Copia `content/projects/_plantilla/` y renómbrala. **El nombre de la carpeta es la URL**: `mi-app/` → `/proyectos/mi-app` (solo minúsculas, números y guiones).
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

No hay ningún paso más. Con `npm run dev` la página se recarga al guardar; en producción, publicar es hacer commit y redeploy.

La carpeta es la **fuente de verdad**: borrar una carpeta borra el proyecto. Si algún `index.md` tiene errores, el build falla y dice cuál. Las carpetas que empiezan por `_` se ignoran.

## Personalizar

| Qué                                               | Dónde                                     |
| ------------------------------------------------- | ----------------------------------------- |
| Nombre, bio, redes, email, stack, certificaciones | `src/config/site.ts`                      |
| Colores y tipografías                             | tokens `@theme` en `src/styles/index.css` |
| Proyectos                                         | `content/projects/`                       |
| Favicon                                           | `public/favicon.svg`                      |

## Estructura

```
src/
├── main.tsx, router.tsx   rutas; el detalle se carga bajo demanda
├── config/site.ts         tus datos personales
├── features/projects/     projects.ts (listado, filtros, tags) + componentes
├── components/            layout y UI reutilizable
└── pages/
```

`features/projects/projects.ts` importa el módulo `virtual:projects`, que genera `vite-plugin-projects.ts`. La búsqueda, el filtro por tag y la paginación se resuelven en el navegador.

## Scripts

| Script              | Qué hace                            |
| ------------------- | ----------------------------------- |
| `npm run dev`       | servidor de desarrollo con recarga  |
| `npm run build`     | comprueba tipos y compila a `dist/` |
| `npm run preview`   | sirve `dist/` para probar el build  |
| `npm run typecheck` | comprueba los tipos                 |

## Contacto

La sección de contacto tiene el enlace `mailto:` y las redes. El **formulario todavía no envía nada**: está deshabilitado en `src/pages/home/Contact.tsx`. Para activarlo sin backend, conéctalo a un servicio de formularios (Formspree, Web3Forms) o a una función serverless.

## Despliegue

Cualquier hosting estático sirve (Vercel, Netlify, Cloudflare Pages, GitHub Pages): comando de build `npm run build`, carpeta de salida `dist`.

Como es una SPA, configura el **fallback a `index.html`** para que rutas como `/proyectos/mi-app` funcionen al entrar directamente o recargar. La forma depende del hosting; en Netlify, por ejemplo, es un `public/_redirects` con `/* /index.html 200`.
