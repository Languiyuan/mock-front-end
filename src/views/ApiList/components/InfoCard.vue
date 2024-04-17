<template>
  <div class="flex-[2] flex flex-wrap content-between justify-between h-full border-r-2 border-r-[#f2f3f5] border-solid p-4">
    <div class="info-item w-full flex items-center h-8 overflow-hidden rounded-xl">
      <div class="label flex items-center pl-3 text-white bg-[#409eff] h-full w-28 text-base">项目根地址</div>
      <div class="flex-1 h-full bg-[#edeffb] flex items-center pl-2">{{ baseUrl }}</div>
      <div class="bg-[#edeffb] pr-4 h-full flex items-center cursor-pointer" title="copy url" @click="handleCopy()">
        <el-icon class="text-xl"><DocumentCopy /></el-icon>
      </div>
    </div>
    <div class="info-item w-[48%] flex items-center h-8 overflow-hidden rounded-xl">
      <div class="label flex items-center pl-3 text-white bg-[#409eff] h-full w-28 text-base">创建人</div>
      <div class="flex-1 h-full bg-[#edeffb] flex items-center pl-2">{{ $props.info.createUsername }}</div>
    </div>
    <div class="info-item w-[48%] flex items-center h-8 overflow-hidden rounded-xl">
      <div class="label flex items-center pl-3 text-white bg-[#409eff] h-full w-28 text-base">创建时间</div>
      <div class="flex-1 h-full bg-[#edeffb] flex items-center pl-2">{{ formatTime($props.info.createTime) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Project } from '@/api/interface'
import { computed } from 'vue'
import { formatTime } from '@/utils/index'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
const $props = defineProps<{
  info: Project.ResPorjectDetail
}>()

const baseUrl = computed(() => {
  return `${window.location.origin}/mock/${$props.info.sign}${$props.info.baseUrl}`
})
const { copy } = useClipboard()
const handleCopy = () => {
  copy(baseUrl.value)
  ElMessage.success('已复制')
}
</script>

<style lang="scss" scoped>
.info-item {
  @apply flex items-center h-8 overflow-hidden rounded-xl;
}
</style>
