<template>
  <div class="w-full h-full" v-loading="loading">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item class="h-[1.2rem]" :to="{ path: '/project/index' }">
        <div class="flex items-center">
          <el-icon class="!text-xl pr-1">
            <FolderOpened />
          </el-icon>
          <div>项目</div>
        </div>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="h-[1.2rem]">{{ projectDetail.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 项目信息 -->
    <div class="flex items-center h-24 w-full mt-4 bg-white">
      <ProjectKeyInfo :info="projectDetail"></ProjectKeyInfo>
      <div class="flex-1 h-full flex items-center justify-center">添加项目成员 待开发</div>
    </div>

    <ApiTable :root-url="rootUrl"></ApiTable>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProjectKeyInfo from '@/views/ApiList/components/ProjectKeyInfo.vue'
import { Project } from '@/api/interface'
import { getProjectDetailApi } from '@/api/modules/project'
import ApiTable from '@/views/ApiList/components/ApiTable.vue'

// 获取项目详情
const route = useRoute()
const router = useRouter()
const projectId = ref(0)
const loading = ref(false)
onMounted(() => {
  projectId.value = Number(route.params.projectId)
  getProjectDetail()
})

const projectDetail = ref<Project.ResPorjectDetail>({
  baseUrl: '',
  createUserId: 0,
  description: '',
  id: 0,
  isDeleted: 0,
  name: '',
  sign: '',
  updateTime: '',
  createTime: '',
  updateUserId: 0
})
const getProjectDetail = async () => {
  try {
    loading.value = true
    const { data } = await getProjectDetailApi({ projectId: projectId.value })
    loading.value = false
    projectDetail.value = data
  } catch (error) {
    router.push('/project/index')
  }
}

const rootUrl = computed(() => {
  return `${window.location.origin}/mock/${projectDetail.value.sign}${projectDetail.value.baseUrl}`
})
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
