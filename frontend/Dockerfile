FROM node:20-bookworm-slim AS base
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 5173
# Vite dev server proxies /api -> backend (see vite.config.ts), so the browser
# only ever talks to this single origin. VITE_PROXY_TARGET points it at the
# backend service on the compose network.
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173"]
