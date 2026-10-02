---
title: SeedFi
summary: Infraestructura de financiamiento programable para proyectos inmobiliarios; el capital queda en un escrow on-chain y se libera por hitos verificados, con elegibilidad probada mediante conocimiento cero.
tags: [TypeScript, Solidity, Noir, ZK, Foundry, Node.js, Docker, Web3]
repo: https://github.com/daniel69zz/seedfi
featured: false
order: 5
date: 2026-09-11
---

## Qué es

**SeedFi** conecta desarrolladores inmobiliarios que necesitan capital con inversionistas. La inversión se liquida en stablecoins, queda en un escrow programable y se libera por tramos, a medida que verificadores independientes acreditan el avance de la obra.

La blockchain se usa para lo que sí resuelve: custodia sin custodio, desembolso condicionado y una auditoría que nadie puede reescribir.

## Lo más interesante

- **Pruebas de conocimiento cero** (circuito en Noir): un inversionista demuestra que cumple el patrimonio mínimo de la ronda sin revelarlo. La prueba se genera en el navegador, dentro de un worker.
- **Liberación por hitos**: cada tramo exige firmas EIP-712 de dos verificadores distintos.
- **El caso que importa es cuando algo sale mal**: si un hito se rechaza, lo no liberado se devuelve a prorrata, sin comisión y sin necesitar la firma del operador.
- **Sin mocks**: el test end-to-end usa pruebas ZK, contratos y firmas reales.
- Todo el sistema (cadena local, contratos, datos de demo, API y UI) se levanta con un solo `docker compose up`.

## Stack

- **Contratos:** Solidity, Foundry; desplegados en HashKey Chain Testnet
- **ZK:** Noir, Barretenberg
- **Backend y frontend:** TypeScript, Vite
- **Infra:** Docker, nginx
