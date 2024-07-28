<template>
  <el-dialog v-model="dialogVisible" title="参数导入" width="500" :before-close="handleClose" append-to-body>
    <template #header>
      Body参数导入
      <el-tooltip class="box-item" effect="dark" content="仅支持JSON对象格式,且会覆盖已配置参数" placement="top">
        <el-button icon="Warning" size="small" circle />
      </el-tooltip>
    </template>
    <div>
      <el-input v-model="content" style="width: 100%" :rows="10" type="textarea" placeholder="仅支持JSON对象格式,且会覆盖已配置参数" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleImport"> 导入 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElNotification, ElMessage } from 'element-plus'
import { isType } from '../../../utils/index'

const $emit = defineEmits<{
  import: [res: SingleParamsRule[]]
}>()

const content = ref(
  '{\r\n  "list|1-10": [\r\n    {\r\n      "id|+1": 1,\r\n      "name": "@cname",\r\n      "age|20-30": 25\r\n    }\r\n  ]\r\n}'
)

const dialogVisible = ref(false)
const handleClose = () => {
  dialogVisible.value = false
}

const open = () => {
  content.value = ''
  dialogVisible.value = true
}

interface SingleParamsRule {
  name: string
  type: string[]
  required: boolean
}

const handleImport = () => {
  try {
    let res: SingleParamsRule[] = []
    const params = JSON.parse(content.value)
    if (isType(params) === 'object') {
      for (let k in params) {
        res.push({
          name: k,
          type: [isType(params[k])],
          required: true
        })
      }
      handleClose()
      $emit('import', res)
    } else {
      ElMessage.error('仅支持JSON对象格式')
    }
  } catch (error: any) {
    ElNotification({
      title: 'Error',
      message: error,
      type: 'error'
    })
    return
  }
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
