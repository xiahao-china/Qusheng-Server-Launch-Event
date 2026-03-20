import { createRouter, createWebHashHistory } from 'vue-router'
// 2. 定义一些路由
const routes = [
  { path: '/', component: () => import('../pages/home.vue') },
]

// 3. 创建路由实例并传递 `routes` 配置
const router = createRouter({
  // 4. 使用 history 模式的实现。
  history: createWebHashHistory(),
  routes: routes,
})

export default router
