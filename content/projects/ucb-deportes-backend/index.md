---
title: UCB Sports Hub — Backend
summary: Backend de la plataforma de gestión deportiva de la Universidad Católica Boliviana; ocho microservicios detrás de un API Gateway, con PostgreSQL, MinIO y Docker Compose.
tags: [NestJS, TypeScript, FastAPI, Python, PostgreSQL, Microservicios, Docker, Nginx]
featured: false
order: 6
date: 2026-05-09
---

## Qué es

Backend de **UCB Sports Hub**, la plataforma de gestión deportiva de la Universidad Católica Boliviana: reservas de canchas, deportistas, equipos, ligas, pagos y reportes.

El repositorio es privado.

## Arquitectura

Ocho servicios detrás de un **API Gateway**, que es el único punto de entrada público:

| Servicio | Stack | Rol |
|---|---|---|
| API Gateway | NestJS | Punto de entrada y proxy a los demás |
| Security | NestJS | Autenticación, usuarios, roles, permisos, auditoría |
| Reservations | NestJS | Reservas de canchas y comprobantes en PDF |
| Sports Management | NestJS | Deportistas, equipos, ligas y fixtures |
| Persons | NestJS | Personas y catálogos |
| Payments | NestJS | Pagos |
| Reports | NestJS | Reportes y analítica |
| Marketing | NestJS | Publicaciones y contenido |
| Credential | FastAPI + Playwright | Credenciales académicas |

## Infraestructura

- **PostgreSQL 17** para persistencia y **MinIO** para imágenes y PDFs.
- **Nginx** como reverse proxy con TLS en el despliegue.
- Todo orquestado con **Docker Compose**; en producción solo Nginx queda expuesto.
- Documentación con Swagger en el gateway.

## Stack

- **Servicios:** NestJS, TypeScript; FastAPI y Playwright para credenciales
- **Datos:** PostgreSQL, MinIO
- **Infra:** Docker Compose, Nginx
