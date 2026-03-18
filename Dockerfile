FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

# 构建前端
WORKDIR /app/frontend
RUN npm install && npm run build

# 回到主目录
WORKDIR /app

EXPOSE 8080

CMD ["node", "server.js"]
