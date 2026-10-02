---
title: Portfolio Full Stack
summary: Este mismo portafolio. API REST en Node/Express que sirve los proyectos desde archivos Markdown, sin base de datos, y un frontend en React desplegado por separado.
tags: [TypeScript, React, Node.js, Express]
featured: true
order: 0
---

## Qué es

Mi portafolio personal, construido como dos aplicaciones independientes que se comunican por una API REST versionada. Los proyectos se escriben como archivos Markdown: el backend los lee y valida al arrancar y responde desde memoria, sin base de datos.

## Stack

- **Backend:** Node.js, Express 5, Zod
- **Frontend:** React, Vite, TanStack Query, Tailwind CSS

## Decisiones

- **Sin base de datos**: el contenido es de un solo autor y cambia con cada deploy, así que una carpeta versionada en git hace de fuente de verdad. Añadir un proyecto es crear una carpeta y hacer commit.
- **Contenido validado al arrancar**: si un `index.md` tiene un error, el servidor dice cuál y no arranca con datos a medias.
- **Imágenes cacheables para siempre**: la URL de cada imagen lleva el hash del archivo, así que cambia sola cuando cambia la imagen.
