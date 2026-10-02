---
title: Mapia — Backend de mapa social ciudadano
summary: API de un mapa social geolocalizado para La Paz, con publicaciones, alertas y búsqueda por cercanía calculada en PostGIS. Proyecto ganador en GDG La Paz 2025.
tags: [NestJS, TypeScript, PostgreSQL, PostGIS, TypeORM, Supabase, JWT, Docker]
repo: https://github.com/daniel69zz/mapia_backend
featured: true
order: 2
---

## Qué es

Backend de **Mapia**, un mapa social ciudadano geolocalizado para La Paz, Bolivia: la gente publica lo que pasa en su zona y el mapa muestra publicaciones y alertas cercanas.

**Proyecto ganador en GDG La Paz 2025.**

## Lo más interesante

- **Cercanía en la base de datos**: las consultas por radio y por área visible del mapa se resuelven con **PostGIS** (`ST_DWithin`, índices GIST), no con Google Maps.
- **Monolito modular**: organización por features con una Clean Architecture ligera.
- **Storage intercambiable**: disco local en desarrollo o Google Cloud Storage en producción, elegido por variable de entorno sin tocar los módulos.
- **Auth** con JWT de acceso y de refresco, y contraseñas con argon2.
- Toda la API documentada en Swagger.

## Módulos

Auth, usuarios y perfiles · publicaciones con media, comentarios y reacciones · mapa y alertas por cercanía · geocodificación · reportes · noticias · chatbot.

## Stack

- **API:** NestJS 11, TypeScript, TypeORM
- **Base de datos:** PostgreSQL + PostGIS (Supabase)
- **Infra:** Docker, despliegue en VPS
