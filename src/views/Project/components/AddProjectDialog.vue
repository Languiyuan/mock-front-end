<template>
  <el-dialog v-model="dialogFormVisible" :title="title" width="500" :before-close="close">
    <el-form ref="addProjectFormRef" :model="formData" :rules="formRules">
      <el-form-item prop="name" label="项目名称">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item prop="baseUrl" label="接口基础路径">
        <el-input v-model="formData.baseUrl" placeholder="example: /test" />
      </el-form-item>
      <el-form-item prop="description" label="项目描述">
        <el-input v-model="formData.description" :rows="4" type="textarea" maxlength="100" show-word-limit />
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
import { ref, reactive, computed, watch } from 'vue'
import { Project } from '../../../api/interface/index'
import { FormInstance } from 'element-plus'
import { addProjectApi, editProjectApi } from '../../../api/modules/project'
import { ElMessage } from 'element-plus'

const $props = defineProps<{
  info: Project.ResPorjectDetail | null
  type: string
}>()
const $emit = defineEmits<{
  success: []
}>()

const title = computed(() => ($props.type === 'add' ? '新增项目' : '编辑项目'))

// 编辑回填
watch(
  () => $props.info,
  () => {
    if ($props.info) {
      const { name, baseUrl, description } = $props.info
      formData.name = name
      formData.baseUrl = baseUrl
      formData.description = description
    } else {
      formData.name = ''
      formData.baseUrl = ''
      formData.description = ''
    }
  },
  { deep: true }
)

const dialogFormVisible = ref(false)
const addProjectFormRef = ref<FormInstance>()
const formData = reactive<Project.EditProjectReq>({
  name: '',
  baseUrl: '',
  description: ''
})
const validateBaseUrl = (rule: any, value: any, callback: any) => {
  const regex = /^\/[a-zA-Z0-9/_-]+$/ // 以斜杠开头的正则表达式
  if (!regex.test(value)) {
    callback(new Error('请输入正确格式的baseUrl'))
  } else {
    callback()
  }
}
const formRules = reactive({
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 3, max: 150, message: '长度 3 到 150', trigger: 'blur' }
  ],
  baseUrl: [
    { required: true, message: '请输入接口基础路径', trigger: 'blur' },
    { min: 3, max: 150, message: '长度 3 到 150', trigger: 'blur' },
    { validator: validateBaseUrl, trigger: 'blur' }
  ],
  description: [{ required: true, message: '请输入项目描述', trigger: 'blur' }]
})

const open = () => {
  dialogFormVisible.value = true
}

const close = () => {
  // reset Form
  addProjectFormRef.value && addProjectFormRef.value.resetFields()
  dialogFormVisible.value = false
}

const submit = () => {
  addProjectFormRef.value?.validate(async (valid) => {
    if (!valid) return
    if ($props.type === 'add') {
      const { data } = await addProjectApi(formData)
      ElMessage.success(data)
    } else {
      const { data } = await editProjectApi({ ...formData, projectId: $props.info?.id || -1 })
      ElMessage.success(data)
    }

    close()
    $emit('success')
  })
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
