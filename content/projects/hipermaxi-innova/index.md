---
title: Maxi — Asistente para el portal de Hipermaxi
summary: Asistente con chat, voz y guías sobre la interfaz, empaquetado como widget embebible en un solo script. Ganador del reto logístico y de toda la hackathon InnovaHack.
tags: [TypeScript, React, Node.js, Python, RAG, OpenAI, Supabase, pgvector]
repo: https://github.com/daniel69zz/hipermaxi_innova
featured: true
order: 1
date: 2026-08-02
---

## Qué es

**Maxi** es un asistente para el portal de proveedores de Hipermaxi: responde por chat y por voz, y además actúa sobre la propia interfaz (resalta elementos, anota y lanza guías paso a paso).

**Ganador del reto logístico y ganador general de la hackathon InnovaHack.**

## Cómo está armado

El repositorio tiene tres piezas:

- **Portal simulado** (React + Vite): banco de pruebas de la integración.
- **`hyperflow-widget`**: el asistente como widget embebible. Se inyecta con un `<script>` y se dibuja en su propio Shadow DOM, así se puede montar sobre el portal real sin tocar su código.
- **`HyperFlow-API`**: backend de chat, voz y RAG. Corre solo con los módulos nativos de Node, sin dependencias npm.

## RAG

Un microservicio en Python da búsqueda semántica sobre los procedimientos (SOPs) de la empresa:

- Embeddings con Gemini, almacenados en **Supabase + pgvector**.
- **Búsqueda híbrida**: full-text en español y vectorial, combinadas con Reciprocal Rank Fusion. Mejora las consultas con jerga y nombres propios, donde lo puramente vectorial falla.
- Si el servicio no está disponible, el backend cae a una búsqueda local por palabras clave y el asistente sigue funcionando.

## Detalles de backend

- Los endpoints que cuestan dinero (voz, chat, RAG) exigen token y tienen límites por identidad; el más estricto es la voz.
- Token de invitado para portales sin sesión propia.

## Stack

- **Widget y portal:** TypeScript, Vite, React
- **Backend:** Node.js, OpenAI (chat y voz)
- **RAG:** Python, Gemini (embeddings), Supabase, pgvector
