import { createRouter, createWebHistory } from 'vue-router'
// 2. 定义一些路由
const routes = [
  { path: '/page/chest/index.html', component: () => import('../pages/home/index.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/page/chest/index.html' },
]

// 3. 创建路由实例并传递 `routes` 配置
const router = createRouter({
  // 4. 使用 history 模式的实现。
  history: createWebHistory(),
  routes: routes,
})

export default router
