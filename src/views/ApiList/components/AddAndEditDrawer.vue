<template>
  <el-drawer
    v-model="drawer"
    direction="rtl"
    size="50%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    class="drawer"
  >
    <div class="w-full h-full bg-gray flex">
      <div class="w-[450px] h-full pl-4 pr-4 bg-blue-600 flex items-center justify-center">
        <el-form
          ref="formRef"
          class="bg-white rounded-sm w-full p-4 flex flex-wrap justify-between content-between"
          :model="formData"
          label-width="auto"
          label-position="top"
          :rules="rules"
        >
          <el-form-item label="接口名称" prop="name" class="w-full">
            <el-input v-model="formData.name" placeholder="接口名称" />
          </el-form-item>
          <el-form-item label="接口类型" class="w-[180px]" prop="method">
            <el-select v-model="formData.method">
              <el-option label="POST" value="POST" />
              <el-option label="GET" value="GET" />
            </el-select>
          </el-form-item>
          <el-form-item label="接口延迟(S)" class="w-[180px]">
            <el-input-number v-model="formData.delay" :min="0" :max="20" disabled />
          </el-form-item>
          <el-form-item label="接口url(不包含baseUrl)" class="w-full" prop="url">
            <el-input v-model="formData.url" placeholder="example: /test" />
          </el-form-item>
          <el-form-item prop="description" label="接口描述" class="w-full">
            <el-input
              v-model="formData.description"
              :rows="4"
              placeholder="请输入接口描述"
              resize="none"
              type="textarea"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="是否开启" class="w-full">
            <el-switch v-model="formData.on" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item class="w-full">
            <el-button class="flex-1" @click="handleClose">取消</el-button>
            <el-button class="flex-1" type="primary" @click="submit"> 保存 </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="flex-1 h-full bg-black"></div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { apiAddApi } from '../../../api/modules/mockApi'
import { MockApi } from '../../../api/interface/index'
import { ElMessage } from 'element-plus'

const $props = defineProps<{
  projectId: number
}>()
const $emit = defineEmits<{
  success: []
}>()

const drawer = ref(false)

const open = () => {
  drawer.value = true
}

const handleClose = () => {
  // reset Form
  formRef.value && formRef.value.resetFields()
  drawer.value = false
}

interface FormData {
  name: string
  url: string
  method: string
  description: string
  delay: number
  on: number
}
const formRef = ref<FormInstance>()
const formData = ref<FormData>({
  name: 'front-1' + new Date().getTime(),
  url: '/test/front' + new Date().getTime(),
  method: 'GET',
  description: '',
  delay: 0,
  on: 1
})

const validateBaseUrl = (rule: any, value: any, callback: any) => {
  const regex = /^\// // 以斜杠开头的正则表达式
  if (!regex.test(value)) {
    callback(new Error('请输入正确格式的baseUrl'))
  } else {
    callback()
  }
}
const rules = reactive({
  name: [
    { required: true, message: '请输入接口名称', trigger: 'blur' },
    { min: 3, max: 150, message: '长度 3 到 150', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请输入接口url', trigger: 'blur' },
    { min: 3, max: 150, message: '长度 3 到 150', trigger: 'blur' },
    { validator: validateBaseUrl, trigger: 'blur' }
  ],
  method: [{ required: true, message: '请选择接口方式', trigger: 'change' }]
})

const submit = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    const params: MockApi.ReqAddApi = {
      projectId: $props.projectId,
      folderId: null,
      mockRule: JSON.stringify('front' + new Date().getTime()),
      ...formData.value
    }

    const { data } = await apiAddApi(params)
    ElMessage.success(data)

    handleClose()
    $emit('success')
  })
}

defineExpose({
  open
})
</script>

<style lang="scss">
.drawer {
  padding: 0;
  min-width: 1200px;
  .el-drawer__header {
    height: 0;
    padding: 0;
    margin: 0;
  }
  .el-drawer__body {
    padding: 0;
  }
}
</style>