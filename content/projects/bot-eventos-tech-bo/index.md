---
title: Bot de eventos tech en Bolivia
summary: Bot de Telegram que avisa de hackathones, meetups y conferencias tech en Bolivia; busca en Google y Luma, filtra con un LLM y deduplica el mismo evento entre fuentes.
tags: [Python, Telegram, LLM, Groq, Docker]
repo: https://github.com/daniel69zz/bot_eventos_tech_bo
featured: false
order: 7
date: 2026-06-01
---

## Qué es

Un bot que avisa por **Telegram** de hackathones, meetups, charlas y conferencias tech en La Paz, Cochabamba, Santa Cruz y Sucre, además de hackathones online abiertas a Bolivia. Incluye eventos de startups y de web3, y descarta lo que es trading o promoción de inversiones.

## Cómo funciona

1. **Búsqueda**: consulta Google a través de Serper y, en paralelo, los eventos publicados en Luma cerca de cada ciudad. Si una fuente falla, la otra sigue.
2. **Filtro por palabras clave**: descarta gratis lo que no parece un evento.
3. **Deduplicación por URL**: no vuelve a procesar lo ya visto.
4. **Detalle del evento**: en Luma, Eventbrite y Meetup abre la página y toma la fecha y el lugar reales, en vez de dejar que el LLM los adivine.
5. **Filtro con LLM**: confirma que es un evento real y extrae ciudad, fecha, titular y descripción.
6. **Deduplicación por evento**: junta en un solo aviso el mismo evento publicado en varias páginas.
7. **Orden por fecha**: prioriza los próximos y descarta los que pasaron hace más de una semana.

## Decisiones

- **Costo bajo**: las consultas rotan entre corridas para gastar pocos créditos de búsqueda.
- **Sin spam**: si el LLM falla, los candidatos no se envían ni se dan por vistos; se reintentan en la siguiente corrida.
- **LLM intercambiable**: usa una API compatible con OpenAI (Groq por defecto), así que cambiar de proveedor es cambiar variables de entorno.

## Stack

- Python, con `requests` como única dependencia externa
- Docker, con una corrida programada cada 8 horas
