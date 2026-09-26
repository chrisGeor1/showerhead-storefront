# Build context is the repo root (see ../docker-compose.yml), because this
# is an npm-workspaces monorepo and the lockfile/hoisted deps live there.

FROM node:20-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY admin/package.json admin/package.json
RUN npm ci

FROM deps AS build
COPY backend backend
RUN npm run db:generate --workspace=backend
RUN npm run build --workspace=backend

FROM node:20-alpine AS runtime
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/backend/node_modules ./backend/node_modules
COPY --from=build /repo/backend/dist ./backend/dist
COPY --from=build /repo/backend/prisma ./backend/prisma
COPY backend/package.json ./backend/package.json

WORKDIR /repo/backend
EXPOSE 4000
CMD ["node", "dist/server.js"]
