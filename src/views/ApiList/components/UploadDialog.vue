<template>
  <el-dialog v-model="dialogVisible" title="上传" :close-on-click-modal="false" width="600px" :before-close="close">
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      drag
      :action="url"
      :headers="headers"
      name="projectFile"
      accept=".json"
      :data="params"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      <template #tip>
        <div class="el-upload__tip"><strong>json</strong> files with a size less than 10M</div>

        <div class="mt-2">
          <span class="pr-1">是否覆盖：</span>
          <el-radio-group v-model="isCover" size="small">
            <el-radio class="!mr-4" value="1" border>是</el-radio>
            <el-radio value="-1" border>否</el-radio>
          </el-radio-group>
        </div>
      </template>
    </el-upload>

    <div v-if="loading" class="h-10 flex items-center justify-center text-lg">解析中...</div>
    <el-table v-else-if="resultData.length" :data="resultData" max-height="250" style="width: 100%" empty-text="-">
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column prop="url" label="url" width="180" show-overflow-tooltip />
      <el-table-column prop="status" label="status" width="80" />
      <el-table-column prop="error" label="error" show-overflow-tooltip />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../../../stores/modules/user'
import { ElMessage } from 'element-plus'
import { ResultData } from '../../../api/interface/index'
import { PORT1 } from '@/api/config/servicePort'

const $emit = defineEmits<{
  success: []
}>()

const url = ref('')
url.value =
  import.meta.env.VITE_USER_NODE_ENV === 'development'
    ? `http://localhost:3000${PORT1}/api/uploadProjectFile`
    : `${PORT1}/api/uploadProjectFile`

const headers = reactive({
  authorization: ''
})

const userStore = useUserStore()
headers.authorization = `Bearer ${userStore.accessToken}`

const loading = ref(false)
const handleBeforeUpload = (file: File) => {
  const fileSizeLimit = 10 * 1024 * 1024 // 限制上传文件大小为 10MB
  if (file.size > fileSizeLimit) {
    ElMessage.error(`文件大小超过限制（10MB）`)
    return false // 阻止文件上传
  }
  resultData.value = []
  loading.value = true
  return true // 允许文件上传
}

interface ResUpload {
  url: string
  status: string
  error: string
}
// 返回结果
const resultData = ref<ResUpload[]>([])
const handleSuccess = (res: ResultData<ResUpload[]>) => {
  resultData.value = res.data
  loading.value = false
  $emit('success')
}

// 上传失败
const handleError = () => {
  loading.value = false
  ElMessage.error('上传失败')
}

const route = useRoute()
const projectId = computed(() => {
  return Number(route.params?.projectId || 0)
})
const isCover = ref<'-1' | '1'>('-1')

const params = computed(() => {
  return { projectId: projectId.value, type: 'normalJson', isCover: isCover.value }
})

const dialogVisible = ref(false)
const open = () => {
  dialogVisible.value = true
}

const uploadRef = ref()
const close = () => {
  resultData.value = []
  // 清空已上传的文件
  uploadRef.value.clearFiles()
  dialogVisible.value = false
}

defineExpose({ open })
</script>
