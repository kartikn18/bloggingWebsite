# isnatll dependencies only when needed
FROM node:20-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci --only=production
# build the source code
FROM node:20-bookworm-slim AS builder
WORKDIR /app
ENV NODE_ENV=production
RUN useradd --create-home --shell /bin/bash appuser

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY main.ts ./
COPY tsconfig.json ./
COPY src ./
COPY public ./
COPY views ./

USER appuser
EXPOSE 3000
CMD ["npm", "start"]