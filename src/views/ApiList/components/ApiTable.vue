<template>
  <div class="wrapper mt-4 h-[calc(100%_-_165px)] bg-white">
    <div class="w-full h-12 pl-4 pr-4 flex items-center justify-between">
      <div class="h-full flex items-center">
        <el-input v-model="queryParams.name" style="width: 240px" class="pr-4" placeholder="接口名称" clearable />
        <el-input v-model="queryParams.url" style="width: 240px" class="pr-4" placeholder="接口url" clearable />
        <el-button type="primary" icon="Search" @click="getApiList">查询</el-button>
      </div>
      <div class="h-full flex items-center">
        <el-button type="primary" icon="Upload">导入</el-button>
        <el-button type="primary" icon="Download">导出</el-button>
        <el-button type="primary" icon="Delete" @click="batchDelete" :disabled="!selectedList.length">批量删除</el-button>
        <el-button type="primary" icon="Plus" @click="handleAddApi">新增接口</el-button>
      </div>
    </div>

    <div>
      <FolderBar v-model="curFolderId" :folder-list="folderList" @success="handleRefreshFolderAndList"></FolderBar>
    </div>

    <div class="h-[calc(100%_-_48px_-_48px_-36px)] pl-4 pr-4">
      <el-table
        :data="tableData"
        height="100%"
        style="width: 100%"
        :border="true"
        header-row-class-name="api-header-row-class-name"
        :default-sort="{ prop: 'createTime', order: 'descending' }"
        @selection-change="handleSelectionChange"
        v-loading="tableLoading"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column v-if="curFolderId === 0 || false" prop="folderId" label="所属目录">
          <template #default="scope">
            {{ getFolderName(scope.row.folderId) }}
          </template>
        </el-table-column>
        <el-table-column prop="method" label="请求类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.method === 'POST' ? 'primary' : 'success'" effect="plain">
              {{ scope.row.method }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="on" label="请求状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.on ? 'success' : 'danger'" effect="dark">
              {{ scope.row.on ? '开启' : '关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="接口地址">
          <template #default="scope">
            {{ scope.row.url }}
            <el-popover placement="top" width="220px" trigger="hover">
              <template #reference>
                <el-icon class="text-xl ml-4"><DocumentCopy /></el-icon>
              </template>
              <div class="w-full flex items-center justify-around">
                <el-button @click="handleCopy(scope.row, 'complete')">完整地址</el-button>
                <el-button type="primary" @click="handleCopy(scope.row, 'api')">接口地址</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="接口描述" />
        <el-table-column prop="createTime" label="创建时间" sortable width="200">
          <template #default="scope">
            {{ formatTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleApiEdit(scope.row)"> 编辑 </el-button>
            <el-button link type="primary" size="small" @click="handleDeleteOne(scope.row)"> 删除 </el-button>
            <template v-if="!folderList.length">
              <el-button link type="primary" size="small" @click="handleMoveApi(scope.row)"> 移动目录 </el-button>
            </template>
            <template v-else>
              <el-popover placement="bottom" width="120px" popper-style="min-width: 120px !important" trigger="hover">
                <template #reference>
                  <el-button link type="primary" size="small"> 更多 </el-button>
                </template>
                <div class="w-full flex flex-col">
                  <el-button link type="primary" size="small" @click="handleMoveApi(scope.row)"> 移动目录 </el-button>
                  <el-button link type="primary" size="small" class="!ml-0 mt-2" @click="handleGoHistory(scope.row)"> 历史记录 </el-button>
                </div>
              </el-popover>
            </template>
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
        @size-change="getApiList"
        @current-change="getApiList"
      />
    </div>
  </div>

  <AddAndEditDrawer ref="drawerRef" :project-id="projectId" :folder-id="curFolderId" @success="handleAddOrEditSuccess"></AddAndEditDrawer>
  <ApiMoveDialog ref="apiMoveRef" :folder-list="folderList" @success="getApiList"></ApiMoveDialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { apiListApi } from '@/api/modules/mockApi'
import { MockApi, Folder } from '../../../api/interface/index'
import { formatTime } from '../../../utils/index'
import { useRoute, useRouter } from 'vue-router'
import AddAndEditDrawer from '@/views/ApiList/components/AddAndEditDrawer.vue'
import { apiBatchDeleteApi } from '../../../api/modules/mockApi'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useClipboard } from '@vueuse/core'
import FolderBar from '@/views/ApiList/components/FolderBar.vue'
import { folderListApi } from '../../../api/modules/project'
import ApiMoveDialog from './ApiMoveDialog.vue'

const $props = defineProps<{
  rootUrl: string
}>()
onMounted(() => {
  getFolderList()
  getApiList()
})
const route = useRoute()
const projectId = computed(() => {
  return Number(route.params?.projectId || 0)
})

// folder
const curFolderId = ref(0)
const folderList = ref<Folder.FolderDetail[]>([])
const getFolderList = async () => {
  const { data } = await folderListApi({ projectId: projectId.value })
  folderList.value = data
}
watch(
  () => curFolderId.value,
  () => {
    queryParams.folderId = curFolderId.value
    getApiList()
  }
)
const getFolderName = (id: number) => {
  const data = folderList.value.find((item) => item.id === id)
  return data?.name || '-'
}

const handleRefreshFolderAndList = () => {
  getFolderList()
}

// api table
const tableData = ref<MockApi.ResApiDetail[]>([])
const paginationInfo = reactive({
  total: 0,
  pageNo: 1,
  pageSize: 20
})

const queryParams: MockApi.ReqApiList = reactive({
  projectId: projectId,
  folderId: curFolderId.value,
  name: '',
  url: '',
  pageNo: paginationInfo.pageNo,
  pageSize: paginationInfo.pageSize
})
const tableLoading = ref(false)
const getApiList = async () => {
  tableLoading.value = true
  queryParams.pageNo = paginationInfo.pageNo
  queryParams.pageSize = paginationInfo.pageSize
  try {
    const { data } = await apiListApi(queryParams)
    tableLoading.value = false
    tableData.value = data.list
    paginationInfo.total = data.total
  } catch (error) {
    tableLoading.value = false
  }
}

const handleDeleteOne = async (row: MockApi.ResApiDetail) => {
  ElMessageBox.confirm('请确认是否删除该api', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const params: MockApi.ReqBatchDeleteApi = {
        projectId: row.projectId,
        ids: [row.id]
      }
      const { data } = await apiBatchDeleteApi(params)
      ElMessage.success(data)
      getApiList()
    })
    .catch(() => {})
}

const selectedList = ref<MockApi.ResApiDetail[]>([])
const handleSelectionChange = (list: MockApi.ResApiDetail[]) => {
  selectedList.value = list
}
const batchDelete = () => {
  ElMessageBox.confirm('请确认是否删除选中的api', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const params: MockApi.ReqBatchDeleteApi = {
        projectId: projectId.value,
        ids: selectedList.value.map((item) => item.id)
      }
      const { data } = await apiBatchDeleteApi(params)
      ElMessage.success(data)
      getApiList()
    })
    .catch(() => {})
}

const drawerRef = ref()
// const type = ref()
const handleAddApi = () => {
  drawerRef.value.open()
}

const handleApiEdit = (row: MockApi.ResApiDetail) => {
  drawerRef.value.open(row)
}
const handleAddOrEditSuccess = () => {
  getApiList()
}

const apiMoveRef = ref()
const handleMoveApi = (row: MockApi.ResApiDetail) => {
  apiMoveRef.value.open(row.id)
}

const { copy } = useClipboard()
const handleCopy = (row: MockApi.ResApiDetail, type: string) => {
  if (type === 'complete') {
    copy(`${$props.rootUrl}${row.url}`)
  } else {
    copy(row.url)
  }

  ElMessage.success('已复制')
}

const router = useRouter()
const handleGoHistory = (row: MockApi.ResApiDetail) => {
  router.push({ path: `/apiHistory/${row.id}` })
}
</script>

<style lang="scss" scoped></style>

<style lang="scss">
.api-header-row-class-name {
  .el-table__cell {
    color: #000;
  }
}
</style>
