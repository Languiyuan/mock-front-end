<template>
  <el-dropdown trigger="click">
    <div class="avatar">
      <img src="@/assets/images/avatar.gif" alt="avatar" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="openDialog('passwordRef')">
          <el-icon><Edit /></el-icon>修改密码
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout">
          <el-icon><SwitchButton /></el-icon>退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <!-- passwordDialog -->
  <PasswordDialog ref="passwordRef"></PasswordDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import PasswordDialog from './PasswordDialog.vue'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const userStore = useUserStore()

// 退出登录
const logout = () => {
  ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 1.清除 Token
    userStore.resetInfo()
    userStore.$reset()
    // 1.重定向到登陆页
    router.replace('/login')
    ElMessage.success('退出登录成功！')
  })
}

// 打开修改密码和个人信息弹窗
const passwordRef = ref<InstanceType<typeof PasswordDialog> | null>(null)
const openDialog = (ref: string) => {
  if (ref == 'passwordRef') passwordRef.value?.openDialog()
}
</script>

<style scoped lang="scss">
.avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
