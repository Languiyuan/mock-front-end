<template>
  <el-dialog v-model="dialogFormVisible" title="导出api接口" width="840" :before-close="close">
    <div class="flex items-center flex-wrap justify-start">
      <el-button class="!ml-2 mr-2 mt-2" type="primary" plain @click="handleInsertText('// lmDescription')">注释：lmDescription</el-button>
      <el-button class="!ml-2 mr-2 mt-2" type="primary" plain @click="handleInsertText('lmFuncName')">函数名：lmFuncName</el-button>
      <el-button class="!ml-2 mr-2 mt-2" type="primary" plain @click="handleInsertText('lmMethod')">请求方式：lmMethod</el-button>
      <el-button class="!ml-2 mr-2 mt-2" type="primary" plain @click="handleInsertText('LMMethod')">请求方式(大写)：LMMethod</el-button>
      <el-button class="!ml-2 mr-2 mt-2" type="primary" plain @click="handleInsertText('lmUrl')">url：lmUrl</el-button>
      <el-button class="!ml-2 mr-2 mt-2" type="primary" plain @click="handleInsertText('lmBaseUrl')">baseUrl：lmBaseUrl</el-button>
    </div>
    <div class="w-full h-72 mt-4">
      <Editor ref="editorRef" :value="apiExportTemplate" language="javascript"></Editor>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handleApplyTemplate"> 设为模板 </el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { MockApi, Project } from '../../../api/interface/index'
import Editor from '@/components/Editor.vue'
import { editProjectApi, getProjectDetailApi } from '@/api/modules/project'
import { useRoute } from 'vue-router'

const $props = defineProps({
  baseUrl: {
    type: String,
    default: ''
  }
})

const route = useRoute()
const projectId = computed(() => {
  return Number(route.params?.projectId || 0)
})

const editorRef = ref()
const selectList = ref<MockApi.ResApiDetail[]>([])
const dialogFormVisible = ref(false)
const open = async (list: MockApi.ResApiDetail[]) => {
  selectList.value = list
  dialogFormVisible.value = true
  await getProjectDetail()
  nextTick(() => {
    // editorRef.value.setEditorContent(
    //   '// lmDescription \n export const lmFuncName = (params) => {return http.lmMethod("lmBaseUrl" + "lmUrl", params)}'
    // )
    editorRef.value.setEditorContent(apiExportTemplate.value)
  })
}

const close = () => {
  dialogFormVisible.value = false
}

// 获取项目详情
const loading = ref(false)
const apiExportTemplate = ref('')
const projectDetail = ref<Project.ResPorjectDetail>()
const getProjectDetail = async () => {
  try {
    loading.value = true
    const { data } = await getProjectDetailApi({ projectId: projectId.value })
    projectDetail.value = data
    loading.value = false
    apiExportTemplate.value = data.apiExportTemplate
  } catch (error) {
    loading.value = false
  }
}

// 设置为导出 api 模板
const handleApplyTemplate = async () => {
  if (!projectDetail.value) return
  let content = editorRef.value.getEditorContent()
  // 去掉首末的空格
  content = content.trim()
  const { id: projectId, name, baseUrl, description } = projectDetail.value

  const { data } = await editProjectApi({ projectId, name, baseUrl, description, apiExportTemplate: content })
  ElMessage.success(data)
}

const handleInsertText = (text: string) => {
  editorRef.value.insertText(text)
}

const submit = async () => {
  let content = editorRef.value.getEditorContent()
  // 去掉首末的空格
  content = content.trim()
  if (content.length > 1000) {
    return ElMessage.error('导出内容不能超过1000个字符')
  }

  let basicContent = ''
  selectList.value.forEach((item) => {
    basicContent += replaceVariables(content, item)
  })

  // 创建 Blob 对象
  const blob = new Blob([basicContent], { type: 'application/javascript' })

  // 创建 URL 并下载
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'exportApi.js'
  a.click()

  // 清理
  URL.revokeObjectURL(url)
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
  const context = $props.baseUrl ? '/' + $props.baseUrl.split('/').pop() : ''
  // 替换字符串
  let result = str.replace(/lmDescription/g, description)
  result = result.replace(/lmFuncName/g, funcName as string)
  result = result.replace(/lmMethod/g, method)
  result = result.replace(/LMMethod/g, variables.method)
  result = result.replace(/lmUrl/g, url)
  result = result.replace(/lmBaseUrl/g, context)

  return result
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
