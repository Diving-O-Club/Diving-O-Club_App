# ---- dev stage ----
FROM node:22-slim AS dev
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:dev"]

# ---- prod build stage ----
FROM node:22-slim AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- prod runtime stage ----
FROM node:22-slim AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

STOPSIGNAL SIGTERM

CMD ["node", "dist/main.js"]