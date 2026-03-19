FROM node:20-alpine AS builder
LABEL "language"="nodejs"
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

WORKDIR /app
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["node", "server.js"]
