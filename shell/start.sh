#!/usr/bin/env bash

cd dist 

# 启动服务
npm run pm2start:test  

# 要有一个阻塞控制台的命令
npx pm2 log  