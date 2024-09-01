<template>
  <div class="bg-white h-full pt-4">
    <div class="w-full h-12 pl-4 pr-4 flex items-center justify-between">
      <div class="h-full flex items-center">
        <el-input v-model="name" style="width: 240px" class="pr-4" placeholder="名称" clearable />
        <el-button type="primary" icon="Search" @click="getAllProject">查询</el-button>
      </div>
      <div class="h-full flex items-center">
        <el-button type="primary" icon="Plus">添加</el-button>
      </div>
    </div>

    <div class="h-[calc(100%_-_48px_-_48px)] pl-4 pr-4">
      <el-table
        :data="tableData"
        height="100%"
        style="width: 100%"
        :border="true"
        header-row-class-name="user-header-row-class-name"
        v-loading="tableLoading"
      >
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="createUsername" label="创建人">
          <template #default="scope">
            {{ scope.row.createUsername || '-' }}
          </template>
        </el-table-column>

        <el-table-column prop="description" label="项目描述" />
        <el-table-column prop="createTime" label="创建时间" sortable width="200">
          <template #default="scope">
            {{ formatTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="members" label="项目成员">
          <template #default="scope">
            <template v-if="scope.row.members && scope.row.members?.length">
              <el-tag
                v-for="(item, index) in scope.row.members"
                :key="'member' + index"
                type="primary"
                class="mr-1"
                effect="light"
                size="large"
                >{{ item.username }}
              </el-tag>
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" :disabled="scope.row.isAdmin" @click="handleAddMember(scope.row)">
              管理成员
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
    </div>

    <div class="w-full h-12 flex items-center justify-end pr-4">
      <el-pagination
        v-model:current-page="paginationInfo.pageNo"
        v-model:page-size="paginationInfo.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationInfo.total"
        @size-change="getAllProject"
        @current-change="getAllProject"
      />
    </div>
  </div>

  <MembersManage ref="membersManageDialog" @success="getAllProject"></MembersManage>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getAllProjectApi } from '../../../api/modules/user'
import { Project } from '../../../api/interface/index'
import { formatTime } from '@/utils/index'
import MembersManage from './components/MembersManage.vue'

onMounted(() => {
  getAllProject()
})
const tableData = ref<Project.ResPorjectDetail[]>([])
const tableLoading = ref(false)
const name = ref('')

const paginationInfo = reactive({
  total: 0,
  pageNo: 1,
  pageSize: 20
})

const getAllProject = async () => {
  const params = {
    name: name.value,
    pageNo: paginationInfo.pageNo,
    pageSize: paginationInfo.pageSize
  }

  tableLoading.value = true
  try {
    const { data } = await getAllProjectApi(params)
    tableData.value = data.list
    paginationInfo.total = data.total
    tableLoading.value = false
  } catch (error) {
    tableLoading.value = false
  }
}

const membersManageDialog = ref<InstanceType<typeof MembersManage>>()
const handleAddMember = (row: Project.ResPorjectDetail) => {
  membersManageDialog.value && membersManageDialog.value.open(row.id, row.createUsername as string)
}
</script>

<style lang="scss">
.user-header-row-class-name {
  .el-table__cell {
    color: #000;
  }
}
</style>
