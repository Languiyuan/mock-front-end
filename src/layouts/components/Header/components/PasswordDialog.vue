<template>
  <el-dialog v-model="dialogVisible" title="修改密码" width="500px" :before-close="close" draggable>
    <el-form ref="passwordFormRef" :model="passwordForm" :rules="rules" size="large">
      <el-form-item prop="password">
        <el-input v-model="passwordForm.password" type="password" placeholder="新密码不能少于6位" show-password autocomplete="new-password">
          <template #prefix>
            <el-icon class="el-input__icon">
              <lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="sumbit(passwordFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElForm, ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
import { updateUserPasswordApi } from '../../../../api/modules/user'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../../../stores/modules/user'

const router = useRouter()
const userStore = useUserStore()
type FormInstance = InstanceType<typeof ElForm>
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  password: ''
})
const rules = reactive({
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度不能少于6位数', trigger: 'blur' }
  ]
})

const dialogVisible = ref(false)
const openDialog = () => {
  dialogVisible.value = true
}

const close = () => {
  passwordFormRef.value && passwordFormRef.value.resetFields()
  dialogVisible.value = false
}

const sumbit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (!valid) return
    await updateUserPassword(passwordForm.password.toString())
    // 清除token userInfo
    userStore.resetInfo()
    router.replace('/login')
  })
}

const updateUserPassword = async (password: string) => {
  const { data } = await updateUserPasswordApi({ password })
  ElMessage.success(data)
}

defineExpose({ openDialog })
</script>
