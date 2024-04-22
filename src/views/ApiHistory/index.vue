<template>
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
    <el-breadcrumb-item class="h-[1.2rem]" :to="{ path: `/apiList/${projectDetail.id}` }">{{
      projectDetail.name || '项目名称'
    }}</el-breadcrumb-item>
    <el-breadcrumb-item class="h-[1.2rem]">{{ tableData[0] ? tableData[0].name : '' }}_历史记录</el-breadcrumb-item>
  </el-breadcrumb>
  <div v-loading="loading" class="wrapper pt-4 mt-4 h-[calc(100%_-_40px)] bg-white">
    <div class="h-[calc(100%_-_48px)] pl-4 pr-4">
      <el-table
        :data="tableData"
        height="100%"
        style="width: 100%"
        :border="true"
        header-row-class-name="api-history-header-row-class-name"
        :default-sort="{ prop: 'updateTime', order: 'descending' }"
      >
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="updateUserId" label="操作人" width="120">
          <template #default="scope">
            <div class="flex items-center">{{ handleGetMember(scope.row.updateUserId) }}</div>
            <div v-if="scope.row.createUserId === userStore.$state.userInfo.id">
              <el-tag type="primary" effect="light">创建者</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operateType" label="操作类型" width="100" />
        <el-table-column prop="mockRule" label="mock规则">
          <template #default="scope">
            <AceReadOnly :mock-rule="scope.row.mockRule"></AceReadOnly>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="操作时间" sortable width="180">
          <template #default="scope">
            {{ formatTime(scope.row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-tooltip class="box-item" effect="dark" content="仅修改mockRule" placement="bottom">
              <el-button link type="primary" size="small" @click="handleMockRuleApply(scope.row)"> 应用规则 </el-button>
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="覆盖当前api" placement="bottom-end">
              <el-button link type="primary" size="small" @click="handleCompleteApply(scope.row)"> 完整应用 </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="w-full h-12 flex items-center justify-end pr-4">
      <el-pagination
        v-model:current-page="paginationInfo.pageNo"
        v-model:page-size="paginationInfo.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationInfo.total"
        @size-change="getApiHistoryList"
        @current-change="getApiHistoryList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, reactive, computed, onMounted } from 'vue'
import { apiHistoryListApi, apiEditApi, apiDetailApi } from '../../api/modules/mockApi'
import { MockApi, Member } from '../../api/interface/index'
import { Project } from '@/api/interface'
import { getProjectDetailApi, getMembersApi } from '../../api/modules/project'
import { formatTime } from '@/utils/index'
import AceReadOnly from './components/AceReadOnly.vue'
import { useUserStore } from '@/stores/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const userStore = useUserStore()

const route = useRoute()
const router = useRouter()
const apiId = computed(() => {
  return Number(route.params?.apiId || 0)
})
onMounted(async () => {
  await getApiHistoryList()
  await getApiDetail()
  await getMembers()
  await getProjectDetail()
})
const loading = ref(false)
const tableData = ref<MockApi.ResApiHistory[]>([])
const paginationInfo = reactive({
  total: 0,
  pageNo: 1,
  pageSize: 20
})

const projectId = ref(0)
const getApiHistoryList = async () => {
  try {
    loading.value = true
    const params: MockApi.ReqApiHistory = {
      apiId: apiId.value,
      pageNo: paginationInfo.pageNo,
      pageSize: paginationInfo.pageSize
    }
    const { data } = await apiHistoryListApi(params)
    tableData.value = data.list
    paginationInfo.total = data.total
    loading.value = false
    // console.log('tableData', tableData)
    projectId.value = data.list[0].projectId
  } catch (error) {
    loading.value = false
  }
}

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
    const { data } = await getProjectDetailApi({ projectId: projectId.value })
    projectDetail.value = data
  } catch (error) {
    router.push('/project/index')
  }
}

const apiDetail = ref<MockApi.ResApiDetail>()
const getApiDetail = async () => {
  const { data } = await apiDetailApi({ id: apiId.value })
  apiDetail.value = data
}

const membersList = ref<Member.MemberDetial[]>([])
const getMembers = async () => {
  const { data } = await getMembersApi({ projectId: projectId.value })
  membersList.value = data
}
const handleGetMember = (updateUserId: number) => {
  const data = membersList.value.find((item) => item.userId === updateUserId)
  return data ? data.username : updateUserId
}

const handleMockRuleApply = (row: MockApi.ResApiHistory) => {
  ElMessageBox.confirm('请确认是否应用该规则', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const params: MockApi.ReqEditApi = {
        id: apiDetail.value!.id,
        projectId: apiDetail.value!.projectId,
        folderId: apiDetail.value!.folderId,
        name: apiDetail.value!.name,
        url: apiDetail.value!.url,
        method: apiDetail.value!.method,
        delay: apiDetail.value!.delay,
        description: apiDetail.value!.description,
        on: apiDetail.value!.on,
        mockRule: row.mockRule
      }
      await apiEdit(params)
      await getApiHistoryList()
    })
    .catch(() => {})
}

const handleCompleteApply = (row: MockApi.ResApiHistory) => {
  ElMessageBox.confirm('请确认是否完整应用该历史记录', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const params: MockApi.ReqEditApi = {
        id: row.apiId,
        projectId: row.projectId,
        folderId: row.folderId,
        name: row.name,
        url: row.url,
        method: row.method,
        delay: row.delay,
        description: row.description,
        on: row.on,
        mockRule: row.mockRule
      }

      await apiEdit(params)
      await getApiHistoryList()
    })
    .catch(() => {})
}
const apiEdit = async (params: MockApi.ReqEditApi) => {
  await apiEditApi(params)
  ElMessage.success('应用成功')
}
</script>

<style lang="scss" scoped></style>

<style lang="scss">
.api-history-header-row-class-name {
  .el-table__cell {
    color: #000;
  }
}
</style>
