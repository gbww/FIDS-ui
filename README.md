# FIDS-ui
FIDS-ui为***前端工程
# 安装服务依赖库
安装nodejs，然后安装服务的依赖库，npm install，生成node_modules文件夹。若此步骤错误，可通过cpnm安装：npm install -g cnpm --registry=https://registry.npm.taobao.org, 接着cnpm install
# 启动本地服务
* 首先需要全局安装gulp和bower，npm/cnpm install -g gulp bower
* npm run serve或者gulp serve，启动本地服务器，启动过程会通过bower安装工程的依赖库，生成bower_components文件夹
* npm run build或者gulp build，编译工程文件，生成dist文件
* npm run lint或者gulp lint，查看js文件格式规范

