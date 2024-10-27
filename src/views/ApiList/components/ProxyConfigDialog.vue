<template>
  <el-dialog v-model="dialogFormVisible" title="代理配置" width="840" :before-close="close">
    <div v-loading="loading" class="w-full h-full">
      <el-form ref="urlFormRef" label-width="auto" :model="urlFormData" :rules="urlRules">
        <el-form-item label="目标地址" prop="targetUrl">
          <el-input v-model="urlFormData.targetUrl" placeholder="example: https://127.0.0.1:8080" />
        </el-form-item>
      </el-form>

      <div class="mt-4">
        <p class="pb-1 font-bold">Headers</p>

        <div class="max-h-60 scrollbar-container">
          <el-form
            v-for="(item, index) in headersFormData"
            :ref="(el: refItem) => setFormRef(el, index, 'header')"
            :rules="formRules"
            :key="index + 'formParams'"
            :inline="true"
            :model="item"
            class="demo-form-inline"
          >
            <el-form-item label="key" style="margin-right: 24px; width: 230px" prop="key">
              <el-input v-model="item.key" placeholder="Cookie" clearable />
            </el-form-item>
            <el-form-item label="value" class="w-[470px]" style="margin-right: 24px" prop="value">
              <el-input v-model="item.value" placeholder="" clearable />
            </el-form-item>

            <el-form-item>
              <el-button type="danger" icon="Delete" size="small" circle @click="handleDeleteForm(index)" />
            </el-form-item>
          </el-form>

          <el-button class="block w-full mt-2" icon="Plus" @click="handleAddForm">Add</el-button>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getProjectDetailApi, setProxyConfig } from '@/api/modules/project'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { reactive, ref, computed } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useRoute } from 'vue-router'
import { Project } from '@/api/interface'

type refItem = Element | ComponentPublicInstance | FormInstance | null

interface UrlFormData {
  targetUrl: string
}
interface singleHeadersFormData {
  key: string
  value: string
}

const route = useRoute()
const projectId = computed(() => {
  return Number(route.params?.projectId || 0)
})

const projectDetail = ref<Project.ResPorjectDetail>()
const loading = ref(false)
const getProjectDetail = async () => {
  loading.value = true
  try {
    const { data } = await getProjectDetailApi({ projectId: projectId.value })
    projectDetail.value = data
    const proxyInfo = data.proxyInfo ? JSON.parse(data.proxyInfo) : { targetUrl: '', headers: [] }
    urlFormData.value.targetUrl = proxyInfo.targetUrl
    headersFormData.value = proxyInfo.headers
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}

const dialogFormVisible = ref(false)
const urlFormRef = ref<FormInstance>()
const urlFormData = ref<UrlFormData>({
  targetUrl: ''
})

const validateUrl = (rule: any, value: any, callback: any) => {
  const regex = /^(https?:\/\/)(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/

  if (value === '') {
    callback(new Error('请填写目标地址'))
  } else if (regex.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确格式的url'))
  }
}

const urlRules = reactive<FormRules<UrlFormData>>({
  targetUrl: [{ required: true, validator: validateUrl, trigger: 'blur' }]
})

const headersFormData = ref<singleHeadersFormData[]>([])
const handleAddForm = () => {
  headersFormData.value.push({ value: '', key: '' })
}
const handleDeleteForm = (index: number) => {
  headersFormData.value.splice(index, 1)
}

const formRules = reactive<FormRules<singleHeadersFormData>>({
  key: [{ required: true, message: '请填写', trigger: 'blur' }],
  value: [{ required: true, message: '请填写', trigger: 'blur' }]
})

const oneValidate = async (formEl: FormInstance | undefined): Promise<boolean> => {
  if (!formEl) return false
  let flag = false
  await formEl.validate((valid) => {
    if (valid) {
      flag = true
      return true
    } else {
      return false
    }
  })

  return flag
}

// 存动态ref
const formRefMap: Record<string, refItem> = {}
const setFormRef = (el: refItem, index: number, type: string) => {
  if (el) {
    formRefMap[`formRef${index}${type}`] = el
  }
}

const confirm = async () => {
  let result: Promise<boolean>[] = []
  // target ip
  result.push(oneValidate(urlFormRef.value))
  Object.values(formRefMap).forEach((item) => {
    result.push(oneValidate(item as FormInstance))
  })

  Promise.allSettled(result).then(async (res) => {
    if (res.findIndex((item) => (item.status === 'fulfilled' && item.value === false) || item.status === 'rejected') > -1) return

    const params = {
      projectId: projectId.value,
      proxyInfo: JSON.stringify({ targetUrl: urlFormData.value.targetUrl, headers: headersFormData.value })
    }
    await setProxyConfig(params)
    ElMessage.success('配置成功')
    close()
  })

  // submit
}
const open = () => {
  getProjectDetail()
  dialogFormVisible.value = true
}

const close = () => {
  dialogFormVisible.value = false
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
.scrollbar-container {
  overflow: hidden auto;
  scrollbar-width: thin;
  scrollbar-color: #c0c4cc #f0f0f0;
  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 8px; /* 设置滚动条宽度 */
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c0c4cc; /* 设置滚动条拖动条颜色 */
    border-radius: 4px; /* 设置拖动条圆角 */
  }

  &::-webkit-scrollbar-track {
    background-color: #f0f0f0; /* 设置滚动条轨道颜色 */
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: #a6aaaf; /* 鼠标悬停时拖动条颜色 */
  }

  &:hover::-webkit-scrollbar-track {
    background-color: #e4e7eb; /* 鼠标悬停时轨道颜色 */
  }
}
</style>
