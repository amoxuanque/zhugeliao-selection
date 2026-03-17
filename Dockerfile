FROM node:18-alpine
LABEL "language"="nodejs"
LABEL "framework"="express"

WORKDIR /app

# 复制所有 package.json 和 lock 文件
COPY package*.json ./
COPY frontend/package*.json frontend/

# 安装根目录依赖
RUN npm install

# 安装前端依赖（包括 devDependencies）
WORKDIR /app/frontend
RUN npm install

# 构建前端
RUN npm run build

# 回到根目录
WORKDIR /app

# 复制所有源代码
COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
