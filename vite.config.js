import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import dotenv from 'dotenv'
var isDev = process.env.NODE_ENV == 'development'
dotenv.config({ path: `./.env.${isDev ? 'development' : 'production'}` })

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
  ],
  server: {
    host: process.env.HOST, // 指定服务器应该监听哪个 IP 地址，默认localhost，可设置为'0.0.0.0'或 true
    port: process.env.PORT,      // 端口号，默认5173
    open: false,	   // 开发服务器启动时，自动在浏览器中打开应用程序
    // 本地代理
    proxy: {
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'views': fileURLToPath(new URL('./src/views', import.meta.url)),
      'components': fileURLToPath(new URL('./src/components', import.meta.url)),
    },
  },
})
