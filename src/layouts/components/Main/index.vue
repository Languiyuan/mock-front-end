<template>
  <el-main>
    <router-view v-slot="{ Component, route }">
      <transition appear name="fade-transform" mode="out-in">
        <component :is="Component" v-if="isRouterShow" :key="route.fullPath" />

        <!-- <keep-alive :include="keepAliveName">
          <component :is="Component" v-if="isRouterShow" :key="route.fullPath" />
        </keep-alive> -->
      </transition>
    </router-view>
  </el-main>
  <el-footer v-if="true">
    <Footer />
  </el-footer>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import Footer from '@/layouts/components/Footer/index.vue'

// 注入刷新页面方法  暂时不用
const isRouterShow = ref(true)
const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val)
provide('refresh', refreshCurrentPage)
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
