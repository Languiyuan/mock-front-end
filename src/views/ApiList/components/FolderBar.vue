<template>
  <el-tabs v-model="curFolderId" type="card" editable class="demo-tabs pl-4 pr-4" @edit="handleTabsEdit">
    <el-tab-pane :name="0">
      <template #label>
        <div class="all-api">ALL_API</div>
      </template>
    </el-tab-pane>
    <el-tab-pane v-for="item in $props.folderList" :key="item.id" :label="item.name" :name="item.id"> </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { computed, watch } from 'vue'
import type { TabPaneName } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addFolderApi, deleteFolderApi } from '@/api/modules/project'
import { useRoute } from 'vue-router'
import { Folder } from '@/api/interface'

const $props = defineProps<{
  folderList: Folder.FolderDetail[]
}>()

const $emit = defineEmits<{
  success: [number]
}>()

const route = useRoute()
const projectId = computed(() => {
  return Number(route.params?.projectId || 0)
})
const curFolderId = defineModel('curFolderId', { type: Number })
watch(
  () => curFolderId.value,
  () => {
    console.log('curFolderId', curFolderId)
    // defineModel 不更新的问题
  }
)
const handleTabsEdit = (targetName: TabPaneName | undefined, action: 'remove' | 'add') => {
  if (action === 'add') {
    addFolder()
  } else if (action === 'remove') {
    deleteFolder(targetName)
  }
}

const addFolder = () => {
  ElMessageBox.prompt('请输入新增目录名称', '新增目录', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    inputPattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,15}$/,
    inputErrorMessage: '字符长度要求2-15,不包含特殊字符'
  })
    .then(async ({ value }) => {
      const params: Folder.AddFolderReq = {
        projectId: projectId.value,
        folderName: value
      }
      const { data } = await addFolderApi(params)
      ElMessage.success(data.msg)
      curFolderId.value = data.id
      $emit('success', curFolderId.value)
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

      $emit('success', curFolderId.value as number)
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
