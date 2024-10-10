import { createRouter, createWebHashHistory } from 'vue-router'
// import Home from '../views/Home.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL), // 路径路由模式 /xxx 
  history: createWebHashHistory(), // hash 路由模式 #/xxx
  routes: [
    {
      path: '/',
      name: 'home',
      // component: Home
      component: () => import('../views/Home.vue') // 异步加载
    },
  ]
})

export default router
