<template>
  <el-dialog v-model="dialogFormVisible" title="导出api接口" width="800" :before-close="close">
    <div class="w-full h-72">
      <Editor ref="editorRef" :value="modelContent" language="javascript"></Editor>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
// import { ElMessage } from 'element-plus'
import { MockApi } from '../../../api/interface/index'
import Editor from '@/components/Editor.vue'
// const $emit = defineEmits<{
//   success: []
// }>()
const dialogFormVisible = ref(false)

const selectList = ref<MockApi.ResApiDetail[]>([])
const open = (list: MockApi.ResApiDetail[]) => {
  selectList.value = list

  dialogFormVisible.value = true
}

const close = () => {
  dialogFormVisible.value = false
}

// todo 应该在项目中配置
const modelContent = ref()
//   `
// // \${description}
// export const \${funcName} = (params) => {
//     return http.\${method}(PORT1 + '\${url}', params)
// }
// `
const editorRef = ref()
nextTick(() => {
  editorRef.value.setEditorContent(
    `
      // \${description}
      export const \${funcName} = (params) => {
          return http.\${method}(PORT1 + '\${url}', params)
      }
    `
  )
})

const submit = async () => {
  let content = editorRef.value.getEditorContent()
  // 去掉首末的反引号
  content = content.trim().replace(/^`|`$/g, '')
  console.log('content', content)
  console.log(JSON.stringify(content))
  // ! 模板
  // `
  // ${description}
  // export const ${funcName} = (params) => {
  //   return http.${method}(PORT1 + '${url}', params)
  // }
  // `

  let basicContent = ''
  selectList.value.forEach((item) => {
    basicContent += replaceVariables(content, item)
  })

  console.log('basicContent', basicContent)

  // 创建 Blob 对象
  const blob = new Blob([basicContent], { type: 'application/javascript' })

  // 创建 URL 并下载
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'generated.js'
  a.click()

  // 清理
  URL.revokeObjectURL(url)
  // return
  // ElMessage.success()
  // close()
  // $emit('success', content)
}
/**
 * 替换字符串中的变量
 *
 * 此函数接收一个字符串和一个变量对象，然后根据变量对象中的值替换字符串中的特定变量标识符
 * 替换的变量标识符格式为`${variableName}`，其中`variableName`是变量对象的属性名
 *
 * @param str 需要进行变量替换的字符串
 * @param variables 包含变量名和值的对象，用于替换字符串中的变量标识符
 * @returns 返回替换后的字符串
 */
const replaceVariables = (str: string, variables: MockApi.ResApiDetail): string => {
  // 检查变量是否存在并提供默认值
  const description = variables.description || ''
  const funcName = variables.url ? variables.url.split('/').pop() : ''
  const method = (variables.method || '').toLowerCase()
  const url = variables.url || ''

  // 替换字符串
  let result = str.replace(/\${description}/g, description)
  result = result.replace(/\${funcName}/g, funcName as string)
  result = result.replace(/\${method}/g, method)
  result = result.replace(/\${url}/g, url)

  return result
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
