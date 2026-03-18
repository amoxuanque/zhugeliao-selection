FROM node:18-alpine
LABEL "language"="nodejs"
LABEL "framework"="react"
WORKDIR /app

# 先复制所有文件
COPY . .

# 安装根目录依赖
RUN npm install

# 进入前端目录并安装依赖
WORKDIR /app/frontend
RUN npm install --include=dev

# 构建前端
RUN npm run build

# 回到根目录
WORKDIR /app

EXPOSE 8080

CMD ["node", "server.js"]
