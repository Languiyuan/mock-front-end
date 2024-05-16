<template>
  <el-dialog v-model="dialogVisible" title="上传" width="500px" :before-close="close">
    <el-upload class="upload-demo" drag :action="url" name="projectFile" accept=".json" :data="params">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      <template #tip>
        <div class="el-upload__tip"><strong>json</strong> files with a size less than 1M</div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const url = ref('')
url.value = import.meta.env.VITE_USER_NODE_ENV === 'development' ? 'http://localhost:3000/api/uploadProjectFile' : '/api/uploadProjectFile'

const route = useRoute()
const projectId = computed(() => {
  return Number(route.params?.projectId || 0)
})
const params = ref()
params.value = { projectId: projectId.value }

const dialogVisible = ref(false)
const open = () => {
  dialogVisible.value = true
}

const close = () => {
  dialogVisible.value = false
}

defineExpose({ open })
</script>
