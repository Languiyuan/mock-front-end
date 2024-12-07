<template>
  <el-dialog v-model="dialogVisible" title="上传" :close-on-click-modal="false" width="600px" :before-close="close">
    <el-upload ref="uploadRef" class="upload-demo" drag accept=".har" :on-change="handleChange" :auto-upload="false">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      <template #tip>
        <div class="el-upload__tip"><strong>HAR</strong> files with a size less than 20M</div>
        <div class="flex items-center">
          <div class="mt-2">
            <span class="pr-1">是否覆盖：</span>
            <el-radio-group v-model="isCover" size="small">
              <el-radio class="!mr-4" value="1" border>是</el-radio>
              <el-radio value="-1" border>否</el-radio>
            </el-radio-group>
          </div>
          <div class="mt-2 ml-6">
            <span class="pr-1">导入数据类型：</span>
            <el-radio-group v-model="useRealData" size="small">
              <el-radio class="!mr-4" value="real" border>真实数据</el-radio>
              <el-radio value="mock" border>mock数据</el-radio>
            </el-radio-group>
          </div>
        </div>
      </template>
    </el-upload>

    <div v-if="curStatus === '解析中'" class="h-10 flex items-center justify-center text-lg">文件解析中...</div>
    <el-table
      v-else-if="curStatus === '解析完成'"
      :data="apiOptions"
      max-height="250"
      style="width: 100%"
      empty-text="-"
      @selection-change="handleSelectChange"
    >
      <el-table-column type="selection" width="60" />
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column prop="url" label="url" show-overflow-tooltip>
        <template #default="scope">{{ context + scope.row.request.url.split(context)[1] }}</template>
      </el-table-column>
    </el-table>
    <div v-else-if="curStatus === '上传中'" class="h-10 flex items-center justify-center text-lg">上传中...</div>

    <el-table v-else-if="curStatus === '上传完成'" :data="resultData" max-height="250" style="width: 100%" empty-text="-">
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column prop="url" label="url" width="180" show-overflow-tooltip />
      <el-table-column prop="status" label="status" width="80" />
      <el-table-column prop="error" label="error" show-overflow-tooltip />
    </el-table>

    <template v-if="curStatus !== '上传完成'" #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../../../stores/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'
// import { ResultData } from '../../../api/interface/index'
import { PORT1 } from '@/api/config/servicePort'
import { Har, Entry } from 'har-format'

const $props = defineProps({
  baseUrl: {
    type: String,
    default: ''
  }
})

const context = computed<string>(() => {
  return `/${$props.baseUrl.split('/').pop()}` || '/'
})

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

const curStatus = ref<'' | '解析中' | '解析完成' | '解析失败' | '上传中' | '上传完成' | '上传失败'>('')

interface ResUpload {
  url: string
  status: string
  error: string
}
// 返回结果
const resultData = ref<ResUpload[]>([])

interface ApiOption {
  url: string
}
const apiOptions = ref<ApiOption[]>([])
const harData = ref<Har>()
const handleChange = (file: any) => {
  console.log(file)
  if (!file) {
    alert('Please select a .har file.')
    return
  }

  const fileSizeLimit = 20 * 1024 * 1024 // 限制上传文件大小为 10MB
  if (file.size > fileSizeLimit) {
    ElMessage.error(`文件大小超过限制（20MB）`)
    return // 阻止文件上传
  }

  curStatus.value = '解析中'
  const reader = new FileReader()
  reader.onload = async function (e) {
    try {
      // const harData: Har = JSON.parse(e!.target!.result as string)
      harData.value = JSON.parse(e!.target!.result as string)
      console.log('harData', harData)
      if (!harData.value) {
        throw Error('Invalid .har file')
      }
      const newEntries = harData.value.log.entries.filter((entry: Entry) => {
        // 仅支持 post get
        const methodFlag = entry.request.method === 'POST' || entry.request.method === 'GET'
        // 判断url是否包含context
        const urlFlag = entry.request.url.includes(context.value)
        // conetent-type为application/json
        const contentypeFlag = entry.response.headers.find(
          (item: { name: string; value: string }) => item.name === 'Content-Type' && item.value.includes('application/json')
        )
        // size 字节 小于 100000
        const sizeFlag = entry.response.content.size < 100000
        
        return methodFlag && urlFlag && contentypeFlag && sizeFlag
      })

      apiOptions.value = deduplicateRequests(newEntries)
      curStatus.value = '解析完成'
    } catch (error) {
      console.error('Error processing the file:', error)
      curStatus.value = '解析失败'
    }
  }

  // Read the file as text
  reader.readAsText(file.raw)
}

// 去重HAR
const deduplicateRequests = (list: Entry[]) => {
  if (list.length === 0) return []

  const urlMap = new Map()

  list.forEach((entry) => {
    const url = entry.request.url
    urlMap.set(url, entry)
  })

  return Array.from(urlMap.values())
}

// 选中
const selectedList = ref<Entry[]>([])
const handleSelectChange = (list: Entry[]) => {
  selectedList.value = list
}

const route = useRoute()
const projectId = computed(() => {
  return Number(route.params?.projectId || 0)
})
const useRealData = ref<'real' | 'mock'>('real')
const isCover = ref<'-1' | '1'>('-1')
const confirm = () => {
  if (selectedList.value.length === 0) {
    ElMessage.error('请选择要上传的接口')
    return
  }

  ElMessageBox.confirm('确认导入?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (!harData.value) return
    harData.value.log.entries = selectedList.value
    // 将 JSON 对象转换为字符串
    const jsonString = JSON.stringify(harData.value, null, 2) // 第二个参数用于美化输出

    // 创建一个 Blob，类型为 application/json
    const blob = new Blob([jsonString], { type: 'application/json' })

    // 创建一个 File 对象，第三个参数是文件名
    const file = new File([blob], 'projectFile.json', { type: 'application/json' })

    const fileSizeLimit = 10 * 1024 * 1024 // 限制上传文件大小为 10MB
    if (file.size > fileSizeLimit) {
      ElMessage.error(`所选接口大小超过限制（10MB），建议分批次上传`)
      return // 阻止文件上传
    }
    curStatus.value = '上传中'
    const formData = new FormData()
    formData.append('projectFile', file)
    formData.append('projectId', projectId.value.toString())
    formData.append('type', 'har')
    formData.append('useRealData', useRealData.value)
    formData.append('isCover', isCover.value)

    fetch(url.value, {
      method: 'POST',
      headers: headers,
      body: formData
    })
      .then((res) => {
        res.json().then((data) => {
          console.log('>>> data', data)
          if (data.code === 200) {
            curStatus.value = '上传完成'
            resultData.value = data.data
            $emit('success')
          } else {
            curStatus.value = '上传失败'
            ElMessage.error('上传失败')
          }
        })
      })
      .catch(() => {
        curStatus.value = '上传失败'
        ElMessage.error('上传失败')
      })
  })
}

const dialogVisible = ref(false)
const open = () => {
  dialogVisible.value = true
}

const uploadRef = ref()
const close = () => {
  curStatus.value = ''
  selectedList.value = []
  apiOptions.value = []
  resultData.value = []
  // 清空已上传的文件
  uploadRef.value.clearFiles()
  dialogVisible.value = false
}

defineExpose({ open })
</script>
