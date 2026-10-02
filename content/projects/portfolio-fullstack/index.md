---
title: Portafolio
summary: Este mismo sitio. Una SPA en React totalmente estática; los proyectos son archivos Markdown que se leen y validan al compilar, sin backend ni base de datos.
tags: [TypeScript, React, Vite, Tailwind CSS]
featured: true
order: 0
---

## Qué es

Mi portafolio personal. Es un sitio estático: cada proyecto es una carpeta con un archivo Markdown y sus imágenes, y un plugin de Vite los convierte en datos al compilar.

## Stack

- React, Vite, React Router, Tailwind CSS
- Zod para validar el frontmatter de cada proyecto

## Decisiones

- **Sin backend ni base de datos**: el contenido es de un solo autor y cambia con cada deploy, así que una carpeta versionada en git hace de fuente de verdad. Añadir un proyecto es crear una carpeta y hacer commit.
- **Contenido validado al compilar**: si un `index.md` tiene un error, el build falla y dice cuál, en vez de publicar datos a medias.
- **Búsqueda y filtros en el navegador**: con decenas de proyectos no hace falta un servidor para filtrar.
- **Imágenes como assets**: Vite les pone el hash en el nombre, así que se cachean para siempre y cambian solas cuando cambia la imagen.
