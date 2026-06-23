FROM node:20-bookworm-slim AS deps

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN useradd --create-home --shell /bin/bash appuser

COPY --from=deps /app/node_modules ./node_modules

COPY package*.json ./
COPY main.ts ./
COPY tsconfig.json ./
COPY src ./src
COPY public ./public
COPY views ./views

RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 3000

CMD ["npm", "start"]