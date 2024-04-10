<template>
  <el-drawer
    v-model="drawer"
    title="I am the title"
    direction="rtl"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <span>Hi, there!</span>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)

const open = () => {
  drawer.value = true
}

const handleClose = () => {
  drawer.value = false
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
