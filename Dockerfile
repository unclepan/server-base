# Dockerfile
FROM node:16
WORKDIR /app
COPY . /app

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
# 安装
RUN npm set registry https://registry.npm.taobao.org
RUN npm i
RUN npm i pm2 -g
RUN npm run build

# 启动
CMD cd dist && npm run pm2start:test && npx pm2 log
# 要有一个阻塞控制台的命令
# CMD echo $SERVER_NAME && echo $AUTHOR_NAME && npm run start:dev

# 环境变量
# ENV SERVER_NAME="server-base"
# ENV AUTHOR_NAME="yangpan"
