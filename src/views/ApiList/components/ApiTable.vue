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
    <div class="h-[calc(100%_-_48px_-_48px)] pl-4 pr-4">
      <el-table
        :data="tableData"
        height="100%"
        style="width: 100%"
        :border="true"
        header-row-class-name="api-header-row-class-name"
        :default-sort="{ prop: 'createTime', order: 'descending' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="method" label="请求类型" width="100" />
        <el-table-column prop="on" label="请求状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.on ? 'success' : 'danger'" effect="dark">
              {{ scope.row.on ? '开启' : '关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="接口地址" />
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

  <AddAndEditDrawer ref="drawerRef" :project-id="projectId" @success="handleAddOrEditSuccess"></AddAndEditDrawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { apiListApi } from '@/api/modules/mockApi'
import { MockApi } from '../../../api/interface/index'
import { formatTime } from '../../../utils/index'
import { useRoute } from 'vue-router'
import AddAndEditDrawer from '@/views/ApiList/components/AddAndEditDrawer.vue'
import { apiBatchDeleteApi } from '../../../api/modules/mockApi'
import { ElMessage, ElMessageBox } from 'element-plus'

onMounted(() => {
  getApiList()
})
const route = useRoute()
const projectId = computed(() => {
  return Number(route.query?.id || 0)
})

const tableData = ref<MockApi.ResApiDetail[]>([])
const paginationInfo = reactive({
  total: 0,
  pageNo: 1,
  pageSize: 20
})

const queryParams: MockApi.ReqApiList = reactive({
  projectId: projectId,
  folder: null,
  name: '',
  url: '',
  pageNo: paginationInfo.pageNo,
  pageSize: paginationInfo.pageSize
})

const getApiList = async () => {
  queryParams.pageNo = paginationInfo.pageNo
  queryParams.pageSize = paginationInfo.pageSize

  const { data } = await apiListApi(queryParams)
  tableData.value = data.list
  paginationInfo.total = data.total
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
  console.log('row', row)
  drawerRef.value.open()
}
const handleAddOrEditSuccess = () => {
  getApiList()
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
