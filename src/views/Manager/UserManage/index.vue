<template>
  <div class="bg-white h-full pt-4">
    <div class="w-full h-12 pl-4 pr-4 flex items-center justify-between">
      <div class="h-full flex items-center">
        <el-input v-model="username" style="width: 240px" class="pr-4" placeholder="名称" clearable />

        <el-select v-model="isAdmin" style="width: 240px" class="pr-4" placeholder="角色" clearable>
          <el-option label="管理员" :value="true" />
          <el-option label="普通成员" :value="false" />
        </el-select>

        <el-button type="primary" icon="Search" @click="getUserList">查询</el-button>
      </div>
      <div class="h-full flex items-center">
        <el-button type="primary" icon="Plus" @click="handleRegister">添加</el-button>
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
        <el-table-column prop="username" label="名称" />
        <el-table-column prop="isAdmin" label="角色">
          <template #default="scope">
            {{ scope.row.isAdmin ? '管理员' : '普通成员' }}
          </template>
        </el-table-column>

        <el-table-column prop="isFrozen" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.isFrozen ? 'danger' : 'success'" effect="dark">
              {{ scope.row.isFrozen ? '已冻结' : '正常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              v-if="!scope.row.isFrozen"
              link
              type="primary"
              size="small"
              :disabled="scope.row.isAdmin"
              @click="handleFrozen(scope.row)"
            >
              冻结
            </el-button>
            <el-button v-else link type="primary" size="small" :disabled="scope.row.isAdmin" @click="handleUnFrozen(scope.row)">
              解冻
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
        @size-change="getUserList"
        @current-change="getUserList"
      />
    </div>
  </div>

  <RegisterDialog ref="RegisterDialogRef" @success="getUserList"></RegisterDialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getUserListApi, freezeApi, unfreezeApi } from '../../../api/modules/user'
import { User } from '../../../api/interface/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import RegisterDialog from './components/RegisterDialog.vue'

onMounted(() => {
  getUserList()
})
const tableData = ref<User.ResUserList[]>([])
const tableLoading = ref(false)
const username = ref('')
const isAdmin = ref<boolean | string>('')

const paginationInfo = reactive({
  total: 0,
  pageNo: 1,
  pageSize: 20
})

const getUserList = async () => {
  const params: User.ReqUserParams = {
    username: username.value,
    pageNo: paginationInfo.pageNo,
    pageSize: paginationInfo.pageSize
  }
  if (typeof isAdmin.value === 'boolean') {
    params.isAdmin = isAdmin.value
  }
  tableLoading.value = true
  try {
    const { data } = await getUserListApi(params)
    tableData.value = data.list
    paginationInfo.total = data.total
    tableLoading.value = false
  } catch (error) {
    tableLoading.value = false
  }
}

// 冻结账户
const handleFrozen = async (row: User.ResUserList) => {
  ElMessageBox.confirm('请确认是否冻结该账户', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await Freeze(row.id)
      await getUserList()
    })
    .catch(() => {})
}

const Freeze = async (id: number) => {
  const { data } = await freezeApi({ userId: id })
  ElMessage.success(data)
}

// 解冻账户
const handleUnFrozen = async (row: User.ResUserList) => {
  ElMessageBox.confirm('请确认是否解冻该账户', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await unfreeze(row.id)
      await getUserList()
    })
    .catch(() => {})
}

const unfreeze = async (id: number) => {
  const { data } = await unfreezeApi({ userId: id })
  ElMessage.success(data)
}

// 添加用户
const RegisterDialogRef = ref()
const handleRegister = () => {
  RegisterDialogRef.value && RegisterDialogRef.value.openDialog()
}
</script>

<style lang="scss">
.user-header-row-class-name {
  .el-table__cell {
    color: #000;
  }
}
</style>
