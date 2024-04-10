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
        <el-button type="primary" icon="Delete">批量删除</el-button>
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
            <el-button link type="primary" size="small"> 编辑 </el-button>
            <el-button link type="primary" size="small" @click="handleDeleteOne(scope)"> 删除 </el-button>
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

  <AddAndEditDrawer ref="drawer"></AddAndEditDrawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { apiListApi } from '@/api/modules/mockApi'
import { MockApi } from '../../../api/interface/index'
import { formatTime } from '../../../utils/index'
import { useRoute } from 'vue-router'
import AddAndEditDrawer from '@/views/ApiList/components/AddAndEditDrawer.vue'

const route = useRoute()

const tableData = ref<MockApi.ResApiDetail[]>([])
const paginationInfo = reactive({
  total: 0,
  pageNo: 1,
  pageSize: 20
})
onMounted(() => {
  getApiList()
})
const queryParams: MockApi.ReqApiList = reactive({
  projectId: Number(route.query?.id || 0),
  folder: null,
  name: '',
  url: '',
  pageNo: paginationInfo.pageNo,
  pageSize: paginationInfo.pageSize
})
const getApiList = async () => {
  // const params: MockApi.ReqApiList = {
  //   projectId: 13,
  //   // name: string
  //   // url: string
  //   pageNo: paginationInfo.pageNo,
  //   pageSize: paginationInfo.pageSize
  // }
  const { data } = await apiListApi(queryParams)
  tableData.value = data.list
  paginationInfo.total = data.total
}

const handleDeleteOne = (data: any) => {
  console.log('data', data)
}

const handleSelectionChange = (list: MockApi.ResApiDetail[]) => {
  console.log('list', list)
}

const drawer = ref()
const handleAddApi = () => {
  drawer.value.open()
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
