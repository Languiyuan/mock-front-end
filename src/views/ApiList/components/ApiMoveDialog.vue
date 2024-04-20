<template>
  <el-dialog v-model="dialogFormVisible" title="移动目录" width="500" :before-close="close">
    <el-form ref="moveApiFormRef" :model="form">
      <el-form-item label="目录">
        <el-select v-model="form.folderId" placeholder="Please select a folder">
          <el-option label="All_API" :value="0" />
          <el-option v-for="item in $props.folderList" :key="item.id + item.name" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Folder, MockApi } from '../../../api/interface/index'
import type { FormInstance } from 'element-plus'
import { apiMoveApi } from '@/api/modules/mockApi'
import { ElMessage } from 'element-plus'

const $props = defineProps<{
  folderList: Folder.FolderDetail[]
}>()
const $emit = defineEmits<{
  success: []
}>()

const moveApiFormRef = ref<FormInstance>()
const dialogFormVisible = ref(false)
const form = reactive({
  folderId: 0
})

const apiId = ref(0)
const open = (id: number) => {
  if (id) {
    apiId.value = id
    dialogFormVisible.value = true
  }
}

const close = () => {
  moveApiFormRef.value && moveApiFormRef.value.resetFields()
  dialogFormVisible.value = false
}

const submit = async () => {
  const params: MockApi.ReqMoveApi = {
    folderId: form.folderId === 0 ? null : form.folderId,
    id: apiId.value
  }

  const { data } = await apiMoveApi(params)
  ElMessage.success(data)
  close()
  $emit('success')
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
