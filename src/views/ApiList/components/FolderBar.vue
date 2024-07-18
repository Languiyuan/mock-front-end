<template>
  <div class="relative w-full h-[38px]">
    <el-tabs v-model="curFolderId" type="card" class="demo-tabs pl-4 pr-4 w-[98%]">
      <el-tab-pane :name="0">
        <template #label>
          <div class="all-api">ALL_API</div>
        </template>
      </el-tab-pane>
      <el-tab-pane v-for="item in $props.folderList" :key="item.id + item.name" :name="item.id">
        <template #label>
          <div class="flex items-center">
            <span>{{ item.name }}</span>

            <el-popover placement="bottom" width="100px" trigger="hover">
              <template #reference>
                <el-icon class="pl-2 !text-2xl"><ArrowDown /></el-icon>
              </template>
              <div class="w-full flex flex-col">
                <el-button text type="danger" icon="Delete" @click="deleteFolder(item.id)">删除目录</el-button>
                <el-button text icon="Edit" class="!ml-0" @click="editFolder(item.name, item.id)">编辑目录</el-button>
              </div>
            </el-popover>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>

    <div class="absolute right-4 top-[50%] -translate-y-1/2 cursor-pointer pr-4">
      <el-icon title="新增目录" @click="addFolder"><FolderAdd /></el-icon>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import type { TabPaneName } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addFolderApi, deleteFolderApi, editFolderApi } from '@/api/modules/project'
import { useRoute } from 'vue-router'
import { Folder } from '@/api/interface'

const $props = defineProps<{
  folderList: Folder.FolderDetail[]
}>()

const $emit = defineEmits<{
  success: []
}>()

const route = useRoute()
const projectId = computed(() => {
  return Number(route.params?.projectId || 0)
})
const curFolderId = defineModel({ type: Number })

curFolderId.value = 0

const addFolder = () => {
  ElMessageBox.prompt('请输入新增目录名称', '新增目录', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    inputPattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,15}$/,
    inputErrorMessage: '字符长度要求2-15,不包含特殊字符'
  })
    .then(async ({ value }) => {
      const params: Folder.ReqAddFolder = {
        projectId: projectId.value,
        folderName: value
      }
      const { data } = await addFolderApi(params)
      ElMessage.success(data.msg)
      curFolderId.value = data.id
      $emit('success')
    })
    .catch(() => {})
}

const deleteFolder = (targetName: TabPaneName | undefined) => {
  if (!targetName) return
  ElMessageBox.confirm('确认删除该目录（其中api不会被删除）?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      console.log('targetName', targetName)
      const { data } = await deleteFolderApi({ id: targetName as number })
      ElMessage({
        type: 'success',
        message: data
      })

      if (curFolderId.value === targetName) {
        curFolderId.value = 0
      }

      $emit('success')
    })
    .catch(() => {})
}

const editFolder = (oldName: string, id: number) => {
  console.log('here----------')
  ElMessageBox.prompt('请输入目录名称', '编辑目录', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    inputPattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,15}$/,
    inputValue: oldName,
    inputErrorMessage: '字符长度要求2-15,不包含特殊字符'
  })
    .then(async ({ value }) => {
      if (value === oldName) {
        ElMessage.success('修改项目名称成功')
        return
      }

      const params: Folder.ReqEditFolder = {
        id: id,
        folderName: value
      }
      const { data } = await editFolderApi(params)
      ElMessage.success(data)
      $emit('success')
    })
    .catch(() => {})
}
</script>
<style lang="scss">
.demo-tabs {
  height: 38px;
  .el-tabs__header {
    border-bottom: none;
  }
}
.demo-tabs > .el-tabs__content {
  height: 0;
  padding: 0;
}
.all-api + i {
  display: none;
}
</style>
