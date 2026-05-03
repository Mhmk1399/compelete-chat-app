# ── Stage 1: Build React client ───────────────────────────────────────────────
FROM node:24-alpine AS client-builder
WORKDIR /app

# Copy package manifests first — Docker caches this layer.
# If you don't change package.json, npm install won't re-run on rebuild.
COPY package.json ./
COPY client/package.json ./client/

RUN npm --prefix client install

# Copy the full client source, then build
COPY client/ ./client/
RUN npm --prefix client run build
# Result is in /app/client/dist — we only need that in the next stage


# ── Stage 2: Production runtime ───────────────────────────────────────────────
FROM node:24-alpine AS runner

# ffmpeg is needed by server/lib/videoTranscode.js
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Install only server production deps (--omit=dev skips devDependencies)
COPY server/package.json ./server/
RUN npm --prefix server install --omit=dev

# Copy server source code
COPY server/ ./server/

# Pull the built frontend from stage 1
# The server resolves this path as: server/../client/dist
COPY --from=client-builder /app/client/dist ./client/dist

# /app/data holds the SQLite database and uploaded files.
# Declaring it as VOLUME means Docker knows it must be persisted externally.
VOLUME ["/app/data"]

EXPOSE 5174

# Run the server directly — no npm wrapper needed at runtime
CMD ["node", "server/index.js"]