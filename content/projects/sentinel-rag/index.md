---
title: Sentinel — RAG legal
summary: Servicio RAG que responde preguntas sobre violencia y derechos en Bolivia y relaciona una evidencia con las leyes que protegen a la persona. 2.º lugar en IPAS Hackathon.
tags: [Python, FastAPI, RAG, Groq, PostgreSQL, sentence-transformers]
repo: https://github.com/daniel69zz/RAG_HACKATON_SENTINEL
featured: true
order: 4
date: 2026-03-19
---

## Qué es

El componente de IA de **Sentinel**: un servicio de *Retrieval-Augmented Generation* que da orientación legal contextual a partir de una base de conocimiento sobre violencia, derechos sexuales y reproductivos, leyes bolivianas e instituciones de apoyo en La Paz.

**2.º lugar en IPAS Hackathon**, junto al [backend de Sentinel](/proyectos/sentinel-backend).

## Qué hace

- **Consultas conversacionales**: `GET /rag/query` responde una pregunta manteniendo la memoria de la conversación.
- **De evidencia a leyes**: `POST /rag/evidence/laws` recibe el relato de una evidencia y devuelve las leyes que aplican.
- Las respuestas se generan solo a partir de los documentos recuperados de la base de conocimiento.

## Stack

- **API:** Python, FastAPI
- **Recuperación:** sentence-transformers para embeddings, PostgreSQL
- **Generación:** Groq
