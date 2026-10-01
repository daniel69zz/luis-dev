# ─── Build ──────────────────────────────────────────────────
FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# prisma generate no conecta a la BD, pero la config exige la variable
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build npx prisma generate && npm run build

# ─── Runtime ────────────────────────────────────────────────
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production NPM_CONFIG_UPDATE_NOTIFIER=false

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY content ./content

RUN mkdir -p uploads && chown -R node:node /app
USER node

EXPOSE 4000
# Migraciones → carga content/projects en la BD → arranca la API
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/scripts/sync-projects.js && node dist/server.js"]
