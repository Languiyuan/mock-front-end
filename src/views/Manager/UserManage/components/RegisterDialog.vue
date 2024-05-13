<template>
  <el-dialog v-model="dialogVisible" title="添加用户" width="500px" :before-close="close" draggable>
    <el-form ref="usernameFormRef" :model="usernameForm" :rules="rules" size="large">
      <el-form-item prop="username">
        <el-input v-model="usernameForm.username" placeholder="请输入用户名 note:默认密码 123456" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="sumbit(usernameFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElForm, ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
import { registerApi } from '../../../../api/modules/user'

const $emit = defineEmits<{
  success: []
}>()

type FormInstance = InstanceType<typeof ElForm>
const usernameFormRef = ref<FormInstance>()
const usernameForm = reactive({
  username: '',
  password: '123456',
  isAdmin: false
})
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 10, message: '用户名长度在10字符串以内', trigger: 'blur' }
  ]
})

const dialogVisible = ref(false)
const openDialog = () => {
  dialogVisible.value = true
}

const close = () => {
  usernameFormRef.value && usernameFormRef.value.resetFields()
  dialogVisible.value = false
}

const sumbit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (!valid) return
    await register()
    $emit('success')
    close()
  })
}

const register = async () => {
  const { data } = await registerApi(usernameForm)
  ElMessage.success(data)
}

defineExpose({ openDialog })
</script>
