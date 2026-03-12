FROM node:18-alpine

WORKDIR /app

# 复制 package.json
COPY package.json .

# 安装依赖
RUN npm ci

# 复制所有源代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
