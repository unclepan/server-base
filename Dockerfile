# Dockerfile
FROM node:16
WORKDIR /app
COPY . /app

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
# 安装
RUN npm set registry https://registry.npm.taobao.org
RUN npm i pm2 -g
RUN npm i

# 启动
CMD echo $SERVER_NAME && echo $AUTHOR_NAME && npm run build && cd dist && npm run pm2start:dev && npx pm2 log
# CMD echo $SERVER_NAME && echo $AUTHOR_NAME && npm run start:dev

# 环境变量
ENV SERVER_NAME="server-base"
ENV AUTHOR_NAME="yangpan"
