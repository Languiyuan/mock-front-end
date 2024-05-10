<template>
  <el-dialog v-model="dialogVisible" title="项目成员管理" width="600">
    <div class="h-96 w-full flex flex-col">
      <div class="h-10 flex items-center">
        <el-autocomplete
          class="w-2/6"
          v-model="searchValue"
          value-key="username"
          :fetch-suggestions="querySearchAsync"
          placeholder="输入名称搜索"
          clearable
          @select="handleSelect"
        />
        <el-button class="ml-4" type="primary" @click="handleAddMember">确认添加</el-button>
      </div>
      <div class="w-full h-[calc(100%_-_40px)] pt-2">
        <el-table height="100%" :data="$props.membersList" header-row-class-name="members-header-row-class-name">
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="operate" label="操作">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleMemberDelete(scope.row)"> 移除 </el-button>
            </template>
          </el-table-column>

          <template #empty>
            <el-empty :image-size="50" description="暂无数据" />
          </template>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Member, User } from '../../../api/interface/index'
import { useRoute } from 'vue-router'
import { findUserByUsernameApi } from '../../../api/modules/user'
import { useUserStore } from '@/stores/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addMemberApi, deleteMemberApi } from '../../../api/modules/project'

const $props = defineProps<{
  membersList: Member.MemberDetial[]
}>()
const $emit = defineEmits<{
  success: []
}>()

const dialogVisible = ref(false)
const open = () => {
  dialogVisible.value = true
  curSelectItem.value = null
  searchValue.value = ''
}
const route = useRoute()
const projectId = computed(() => {
  return Number(route.params?.projectId || 0)
})

const userStore = useUserStore()
const userInfo = computed(() => userStore.$state.userInfo)

const searchValue = ref('')

const curSelectItem = ref<User.ResUsersByUsername | null>()
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  if (!queryString) {
    return cb([])
  }
  findUserByUsername(queryString).then((list) => {
    if (list.length) {
      const newList = list.filter((item) => item.username !== userInfo.value.username)
      cb(newList)
    } else {
      cb([])
    }
  })
}
const findUserByUsername = async (username: string) => {
  const { data } = await findUserByUsernameApi({ username })
  return data
}
const handleSelect = (item: User.ResUsersByUsername | Record<string, any>) => {
  console.log(item)
  curSelectItem.value = item as User.ResUsersByUsername
}
watch(
  () => searchValue.value,
  () => {
    if (curSelectItem.value && searchValue.value !== curSelectItem.value.username) {
      curSelectItem.value = null
    }

    console.log('curSelectItem.value', curSelectItem.value)
  }
)

const handleAddMember = async () => {
  if (!curSelectItem.value) {
    return ElMessage.error('请先选择成员')
  }
  const params: Member.ReqAddMember = {
    projectId: projectId.value,
    memberId: curSelectItem.value.id
  }
  const { data } = await addMemberApi(params)
  $emit('success')
  ElMessage.success(data)
}

const handleMemberDelete = async (row: Member.MemberDetial) => {
  ElMessageBox.confirm('请确认是否删除', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const params: Member.ReqDeleteMember = {
        memberId: row.userId,
        projectId: row.projectId
      }
      const { data } = await deleteMemberApi(params)
      $emit('success')

      ElMessage.success(data)
    })
    .catch(() => {})
}

defineExpose({
  open
})
</script>

<style lang="scss">
.members-header-row-class-name {
  .el-table__cell {
    color: #000;
  }
}
</style>
