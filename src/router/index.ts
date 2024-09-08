import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'main',
      redirect: '/login'
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
        },
        {
          path: '/manager/index',
          name: 'manager',
          component: () => import('@/views/Manager/index.vue'),
          redirect: '/userManage/index',
          meta: {
            icon: 'Grid',
            title: '管理员',
            isLink: '',
            isHide: false,
            isFull: false,
            isAffix: true,
            isKeepAlive: true
          },
          children: [
            {
              path: '/userManage/index',
              name: 'userManager',
              component: () => import('@/views/Manager/UserManage/index.vue'),
              meta: {
                icon: '',
                title: '成员管理',
                isLink: '',
                isHide: false,
                isFull: false,
                isAffix: true,
                isKeepAlive: true
              }
            },
            {
              path: '/projectManage/index',
              name: 'projectManage',
              component: () => import('@/views/Manager/ProjectManage/index.vue'),
              meta: {
                icon: '',
                title: '项目管理',
                isLink: '',
                isHide: false,
                isFull: false,
                isAffix: true,
                isKeepAlive: true
              }
            }
          ]
        },
        {
          path: '/apiList/:projectId',
          name: 'apiList',
          component: () => import('@/views/ApiList/index.vue'),
          meta: {
            icon: '',
            title: '接口列表',
            isLink: '',
            isHide: false,
            isFull: false,
            isAffix: true,
            isKeepAlive: true
          }
        },
        {
          path: '/apiHistory/:apiId',
          name: 'apiHistory',
          component: () => import('@/views/ApiHistory/index.vue'),
          meta: {
            icon: '',
            title: '接口历史记录',
            isLink: '',
            isHide: false,
            isFull: false,
            isAffix: true,
            isKeepAlive: true
          }
        }
      ]
    },
    {
      path: '/500',
      name: '500',
      component: () => import('@/views/Error/500.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/Error/404.vue')
    }
  ]
})

export default router
