# 开发环境编译 本机启动
1.第一步clone仓库

    git clone git@github.com:unclepan/server-base.git

2.进入工厂目录

    cd server-base

3.下载包文件

    npm install

4.启动测试服务，前提是启动好了你本机的mysql服务和mongodbd的服务

    npm run start:dev

# 测试环境编译 本机启动，使用docker部署
1.本地安装docker

2.编译

    docker-compose build base-server

3.启动服务

    docker-compose up -d

# 正式环境编译 本机启动
1.编译

    npm run build

2.进入dist目录

    cd dist

3.启动服务

    npm run compile:xxx




