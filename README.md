# electron-demo
electron 使用 演示


```shell

# electron依赖
cnpm install npm install --save-dev electron
# 热更新 / 热加载
cnpm install nodemon -D
# 一个命令启动electron程序
cnpm install concurrently



# 下载 electron https://github.com/electron/electron/releases
# https://registry.npmmirror.com/binary.html?path=electron/

# 放到 ~\AppData\Local\electron\Cache


# 下载 winCodeSign https://github.com/electron-userland/electron-builder-binaries/releases
# https://registry.npmmirror.com/binary.html?path=electron-builder-binaries/

# 解压到 ~/AppData/local/electron-builder/Cache/winCodeSign/winCodeSign-x.x.x


# 下载 nsis-x.x.x https://github.com/electron-userland/electron-builder-binaries/releases
# https://registry.npmmirror.com/binary.html?path=electron-builder-binaries/

# 解压到 ~/AppData/local/electron-builder/Cache/nsis/nsis-x.x.x


# 下载 nsis-resources-x.x.x https://github.com/electron-userland/electron-builder-binaries/releases
# https://registry.npmmirror.com/binary.html?path=electron-builder-binaries/

# 解压到 ~/AppData/local/electron-builder/Cache/nsis/nsis-resources-x.x.x


# 修改 ~\AppData\Roaming\nvm\v20.16.0\node_modules\cnpm\node_modules\npminstall\bin\install.js
# registry = registry || 'https://registry.npmjs.com';
# registry = registry || 'https://registry.npmmirror.com';


# 运行 
cnpm run dev

# 打包 静态资源
cnpm run build

# 打包 electron
cnpm run electron:build

# 解压 asar 文件
cnpm install -g asar

asar extract ./build/win-unpacked/resources/app.asar ./build/win-unpacked/resources/app
```