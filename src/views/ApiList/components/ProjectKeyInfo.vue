<template>
  <el-descriptions class="margin-top w-4/6" :column="2" size="large" :border="true">
    <el-descriptions-item :span="2">
      <template #label>
        <div class="flex items-center">
          <el-icon class="mr-1">
            <Link />
          </el-icon>
          项目根地址
        </div>
      </template>

      <div class="h-full flex items-center">
        <div>{{ baseUrl }}</div>
        <el-icon class="text-xl ml-1" title="copy url" @click="handleCopy()"><DocumentCopy /></el-icon>
      </div>
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <div class="flex items-center">
          <el-icon class="mr-1">
            <user />
          </el-icon>
          创建人
        </div>
      </template>
      {{ $props.info.createUsername }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="flex items-center">
          <el-icon class="mr-1">
            <Clock />
          </el-icon>
          创建时间
        </div>
      </template>
      {{ formatTime($props.info.createTime) }}
    </el-descriptions-item>
  </el-descriptions>
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
  if (navigator.clipboard) {
    copy(baseUrl.value)
  } else {
    const input = document.createElement('input')
    input.setAttribute('value', baseUrl.value)
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }

  ElMessage.success('已复制')
}
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
