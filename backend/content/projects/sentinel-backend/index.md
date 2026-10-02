---
title: Sentinel — Backend
summary: API REST para registrar incidentes, evidencias, audios y contactos de emergencia de una app de seguridad personal. 2.º lugar en IPAS Hackathon junto al RAG legal de Sentinel.
tags: [Node.js, Express, Supabase, PostgreSQL, OpenAI, Docker]
repo: https://github.com/OddALaCream/Sentinel-Backend
featured: true
order: 3
date: 2026-03-19
---

## Qué es

Backend de **Sentinel**, una aplicación de seguridad personal: permite registrar incidentes, guardar evidencias, y gestionar contactos de emergencia.

**2.º lugar en IPAS Hackathon**, junto al [RAG legal de Sentinel](/proyectos/sentinel-rag). Proyecto en equipo.

## Qué hace

- **Incidentes** con tipo, nivel de riesgo y estado, asociables a contactos de emergencia.
- **Evidencias** (archivos y audio) en un bucket privado; se pueden subir sin incidente y asociarlas después.
- **Transcripción de audio** con OpenAI.
- **Autenticación** con Supabase Auth y acceso a datos protegido con RLS.
- Registro de auditoría de las acciones.
- Se conecta con el servicio RAG para relacionar una evidencia con las leyes que protegen a la persona.

## Stack

- **API:** Node.js, Express, zod, multer
- **Datos:** Supabase (Auth, PostgreSQL, Storage)
- **Infra:** Docker, despliegue en VPS detrás de Nginx
