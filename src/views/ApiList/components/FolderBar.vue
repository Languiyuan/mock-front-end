<template>
  <el-tabs v-model="curfolderId" type="card" editable class="demo-tabs pl-4 pr-4" @edit="handleTabsEdit">
    <el-tab-pane :name="0">
      <template #label>
        <div class="all-api">ALL_API</div>
      </template>
    </el-tab-pane>
    <el-tab-pane v-for="item in $props.folderList" :key="item.id" :label="item.name" :name="item.id"> </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import type { TabPaneName } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addFolderApi } from '@/api/modules/project'
import { useRoute } from 'vue-router'
import { Folder } from '@/api/interface'

const $props = defineProps<{
  folderList: Folder.FolderDetail[]
}>()

const route = useRoute()
const projectId = computed(() => {
  return Number(route.params?.projectId || 0)
})
const curfolderId = defineModel('curfolderId', { type: Number })

const handleTabsEdit = (targetName: TabPaneName | undefined, action: 'remove' | 'add') => {
  if (action === 'add') {
    addFolder()
  } else if (action === 'remove') {
    console.log('remove++++++++++')

    curfolderId.value = 0
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
      ElMessage.success(data)
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
