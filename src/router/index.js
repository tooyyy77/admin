import Vue from 'vue'
import Router from 'vue-router'
import jwt from 'jsonwebtoken'
const JWT_SECRET = 'tooyyy77'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/article',
    name: 'article',
    component: Layout,
    meta: { title: '文章', icon: 'el-icon-document' },
    children: [
      {
        path: 'articleManage',
        name: 'articleManage',
        component: () => import('@/views/article/articleManage/index'),
        meta: { title: '文章管理', icon: 'el-icon-data-analysis' }
      },
      {
        path: 'articleEdit',
        name: 'articleEdit',
        component: () => import('@/views/article/articleEdit/index'),
        meta: { title: '写文章', icon: 'el-icon-edit-outline' }
      }
  ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
//路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.userToken ? true : false;
  if (to.path == '/login' || to.path == '/register') {
      next();
  } else {
      isLogin ? next() : next('/login');
  }
});


export default router
