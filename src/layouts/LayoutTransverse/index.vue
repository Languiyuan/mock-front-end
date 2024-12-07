<!-- 横向布局 -->
<template>
  <el-container class="layout">
    <el-header>
      <div class="logo flex items-center justify-center">
        <img class="logo-img" src="@/assets/images/logo.svg" alt="logo" />
        <span class="logo-text">{{ title }}</span>
      </div>
      <el-menu mode="horizontal" :default-active="activeMenu" :router="false" :unique-opened="true">
        <!-- 不能直接使用 SubMenu 组件，无法触发 el-menu 隐藏省略功能 -->
        <template v-for="subItem in menuList" :key="subItem.path">
          <el-sub-menu v-if="subItem?.children?.length" :key="subItem.path" :index="subItem.path + 'el-sub-menu'">
            <template #title>
              <el-icon>
                <component :is="subItem.meta.icon"></component>
              </el-icon>
              <span>{{ subItem.meta.title }}</span>
            </template>
            <SubMenu :menu-list="subItem?.children" />
          </el-sub-menu>
          <el-menu-item v-else :key="subItem.path + 'el-menu-item'" :index="subItem.path" @click="handleClickMenu(subItem)">
            <el-icon>
              <component :is="subItem.meta.icon"></component>
            </el-icon>
            <template #title>
              <span>{{ subItem.meta.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
      <ToolBarRight />
    </el-header>
    <Main />
  </el-container>
</template>

<script setup lang="ts" name="layoutTransverse">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Main from '@/layouts/components/Main/index.vue'
import ToolBarRight from '@/layouts/components/Header/ToolBarRight.vue'
import SubMenu from '@/layouts/components/Menu/SubMenu.vue'
import { useUserStore } from '@/stores/modules/user'

const title = import.meta.env.VITE_GLOB_APP_TITLE
const userStore = useUserStore()

const route = useRoute()
const router = useRouter()
const defaultMenuList = [
  {
    path: '/project/index',
    name: 'project',
    component: '/project/index',
    meta: {
      icon: 'FolderOpened',
      title: '项目列表',
      isLink: '',
      isHide: false,
      isFull: false,
      isAffix: true,
      isKeepAlive: true
    },
    children: []
  }
  // {
  //   path: '/personalCenter/index',
  //   name: 'personalCenter',
  //   component: '/personalCenter/index',
  //   meta: {
  //     icon: 'UserFilled',
  //     title: '个人中心',
  //     isLink: '',
  //     isHide: false,
  //     isFull: false,
  //     isAffix: true,
  //     isKeepAlive: true
  //   },
  //   children: []
  // }
]

const menuList = computed(() => {
  const adminRoute = {
    path: '/Manager/index',
    name: 'manager',
    component: '/Manager/index',
    meta: {
      icon: 'Grid',
      title: '管理员页面',
      isLink: '',
      isHide: false,
      isFull: false,
      isAffix: true,
      isKeepAlive: true
    },
    children: [
      {
        path: '/userManage/index',
        name: 'manager',
        component: '/UserManage/index',
        meta: {
          icon: 'UserFilled',
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
        name: 'manager',
        component: '/ProjectManage/index',
        meta: {
          icon: 'Memo',
          title: '项目管理',
          isLink: '',
          isHide: false,
          isFull: false,
          isAffix: true,
          isKeepAlive: true
        }
      }
    ]
  }

  return userStore.$state.userInfo.isAdmin ? [...defaultMenuList, adminRoute] : defaultMenuList
})
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)

const handleClickMenu = (subItem: any) => {
  if (subItem.meta.isLink) return window.open(subItem.meta.isLink, '_blank')
  router.push(subItem.path)
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
