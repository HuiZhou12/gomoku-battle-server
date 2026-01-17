import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

/**
 * 路由定义
 * 路由只负责页面访问权限，不做业务逻辑
 */
const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('../view/LoginView.vue'),
  },
  {
    path: '/home',
    component: () => import('../view/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/game/:roomId',
    component: () => import('../view/GameView.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * 全局登录态守卫
 * 只负责：是否已登录
 */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  // 已登录用户禁止回登录页
  if (to.path === '/login' && token) {
    next('/home');
    return;
  }

  // 需要登录但没有 token
  if (to.meta.requiresAuth && !token) {
    next('/login');
    return;
  }

  next();
});

/**
 * 游戏页面守卫（单独处理）
 * 允许进入 game 页面，但校验房间合法性
 */
router.beforeEach((to, from, next) => {
  if (!to.path.startsWith('/game')) {
    next();
    return;
  }

  const matchStore = store.matchStore();
  const routeRoomId = to.params.roomId;
  const currentRoomId = matchStore.getMachId;

  /**
   * 场景说明：
   * 1. 正常从大厅进入游戏（roomId 一致）
   * 2. 页面刷新 / 断线重连（store 可能为空）
   *
   * 对策：
   * - 如果 store 有房间信息，必须一致
   * - 如果 store 还没恢复，先放行，由 GameView 自己拉状态
   */
  if (currentRoomId && currentRoomId !== routeRoomId) {
    console.warn('非法访问游戏房间，重定向回大厅');
    next('/home');
    return;
  }

  next();
});

export default router;
