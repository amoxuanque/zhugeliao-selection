FROM node:18-alpine
LABEL "language"="nodejs"
LABEL "framework"="express"

WORKDIR /app

# 复制根目录 package.json 和 lock 文件
COPY package.json package-lock.json* ./

# 安装根目录依赖
RUN npm install

# 复制前端目录（包括 package.json 和 lock 文件）
COPY frontend/ frontend/

# 进入前端目录安装依赖（包括 devDependencies）
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
