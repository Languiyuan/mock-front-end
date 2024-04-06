import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'main',
      redirect: '/project/index'
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Login/index.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/layout',
      name: 'layout',
      component: () => import('@/layouts/index.vue'),
      // component: () => import("@/layouts/indexAsync.vue"),
      redirect: '/home/index',
      children: [
        {
          path: '/home/index',
          name: 'home',
          component: () => import('@/views/Home/index.vue'),
          meta: {
            icon: 'HomeFilled',
            title: '首页',
            isLink: '',
            isHide: false,
            isFull: false,
            isAffix: true,
            isKeepAlive: true
          }
        },
        {
          path: '/project/index',
          name: 'project',
          component: () => import('@/views/Project/index.vue'),
          meta: {
            icon: 'FolderOpened',
            title: '项目列表',
            isLink: '',
            isHide: false,
            isFull: false,
            isAffix: true,
            isKeepAlive: true
          }
        },
        {
          path: '/personalCenter/index',
          name: 'personalCenter',
          component: () => import('@/views/PersonalCenter/index.vue'),
          meta: {
            icon: 'HomeFilled',
            title: '个人中心',
            isLink: '',
            isHide: false,
            isFull: false,
            isAffix: true,
            isKeepAlive: true
          }
        }
      ]
    }
  ]
})

export default router
