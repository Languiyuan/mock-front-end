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
      <div class="flex-1 h-full flex flex-wrap items-center justify-center">
        <template v-if="isCreateUser">
          <template v-if="membersList.length">
            <el-tag v-for="(item, index) in membersList" :key="'member' + index" type="primary" class="mr-1" effect="light" size="large">{{
              item.username
            }}</el-tag>
            <el-button type="primary" icon="Plus" text @click="handleAddMember"></el-button>
          </template>
          <template v-else>
            <el-button size="large" type="primary" icon="Plus" text @click="handleAddMember">添加项目成员</el-button>
          </template>
        </template>
        <template v-else>
          <el-tag v-for="(item, index) in membersList" :key="'member' + index" type="primary" class="mr-1" effect="light" size="large">{{
            item.username
          }}</el-tag>
        </template>
      </div>
    </div>

    <ApiTable :root-url="rootUrl"></ApiTable>

    <MembersManage ref="membersManageDialog" :members-list="membersList" @success="getMembers"></MembersManage>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProjectKeyInfo from '@/views/ApiList/components/ProjectKeyInfo.vue'
import { Project } from '@/api/interface'
import { getProjectDetailApi } from '@/api/modules/project'
import ApiTable from '@/views/ApiList/components/ApiTable.vue'
import MembersManage from '@/views/ApiList/components/MembersManage.vue'
import { Member } from '../../api/interface/index'
import { getMembersApi } from '../../api/modules/project'
import { useUserStore } from '@/stores/modules/user'
import { PORT1, PORT3 } from '@/api/config/servicePort'

// 获取项目详情
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const userStore = useUserStore()
const userInfo = computed(() => userStore.$state.userInfo)

const projectId = computed(() => Number(route.params.projectId))

onMounted(() => {
  getProjectDetail()
  getMembers()
})
const isCreateUser = ref(false)
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
  updateUserId: 0,
  apiExportTemplate: ''
})
const getProjectDetail = async () => {
  try {
    loading.value = true
    const { data } = await getProjectDetailApi({ projectId: projectId.value })
    loading.value = false
    projectDetail.value = data
    isCreateUser.value = userInfo.value.id === data.createUserId
  } catch (error) {
    loading.value = false
    router.push('/project/index')
  }
}

const rootUrl = computed(() => {
  return `${window.location.origin}:${PORT3}/${PORT1}/mock/${projectDetail.value.sign}${projectDetail.value.baseUrl}`
})

// 包含创建者
const membersList = ref<Member.MemberDetial[]>([])
const getMembers = async () => {
  const { data } = await getMembersApi({ projectId: projectId.value })
  membersList.value = data.filter((item) => item.isCreateUser === 0)
}

const membersManageDialog = ref()
const handleAddMember = () => {
  membersManageDialog.value.open()
}
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
