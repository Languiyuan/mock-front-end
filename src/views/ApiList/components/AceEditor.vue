<template>
  <div class="h-full w-full flex flex-col">
    <div class="h-10 w-full bg-black flex items-center pl-4">
      <el-button color="#2563eb" size="small" plain @click="handleFormat">格式化</el-button>
      <div class="flex items-center w-40 pr-4 pl-4">
        <div class="text-xs text-white w-16">字号:</div>
        <el-select v-model="options.fontSize" size="small">
          <el-option v-for="item in fontSizeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="flex items-center justify-between w-28 pr-4 pl-4">
        <div class="text-xs text-white w-16">主题:</div>
        <el-switch
          v-model="aceTheme"
          style="--el-switch-on-color: #2c2c2c; --el-switch-off-color: #dcdfe6"
          inline-prompt
          active-icon="Sunny"
          inactive-icon="Moon"
          inactive-value="github"
          active-value="monokai"
        />
      </div>
    </div>
    <div class="flex-1 w-full">
      <v-ace-editor :key="editorKey" v-model:value="content" lang="json" :theme="aceTheme" style="height: 100%" :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { VAceEditor } from 'vue3-ace-editor'
import './ace.config'
import type { Ace } from 'ace-builds'
import beautify from 'js-beautify'
import { ElNotification } from 'element-plus'

const content = ref(
  '{\r\n  "list|1-10": [\r\n    {\r\n      "id|+1": 1,\r\n      "name": "@cname",\r\n      "age|20-30": 25\r\n    }\r\n  ]\r\n}'
)
const options: Partial<Ace.EditorOptions> = reactive({
  useWorker: true, // 启用语法检查,必须为true
  enableBasicAutocompletion: true, // 自动补全
  enableLiveAutocompletion: true, // 智能补全
  enableSnippets: true, // 启用代码段
  showPrintMargin: false, // 去掉灰色的线，printMarginColumn
  highlightActiveLine: true, // 高亮行
  highlightSelectedWord: true, // 高亮选中的字符
  tabSize: 2, // tab锁进字符
  fontSize: 14, // 设置字号
  wrap: false, // 是否换行
  readOnly: false, // 是否可编辑
  newLineMode: 'windows' // 换行风格
  // minLines: 10, // 最小行数，minLines和maxLines同时设置之后，可以不用给editor再设置高度
  // maxLines: 50, // 最大行数
})
// watch(
//   () => content.value,
//   () => {
//     console.log('content.value', content.value)
//     const data = JSON.stringify(content.value)
//     console.log('data', data)
//   }
// )

// * 操作栏
const editorKey = ref(new Date().getTime())

const fontSizeOptions = reactive([
  { label: 12, value: 12 },
  { label: 14, value: 14 },
  { label: 16, value: 16 },
  { label: 18, value: 18 },
  { label: 20, value: 20 }
])

watch(
  () => options.fontSize,
  () => {
    editorKey.value = new Date().getTime()
  }
)
const aceTheme = ref('monokai')

const handleFormat = () => {
  const options1 = { indent_size: 2, space_in_empty_paren: true }

  // content.value = beautify(JSON.stringify(JSON.parse(content.value)), options)
  content.value = beautify(content.value, options1)
}

const setContent = (data: string) => {
  content.value = data
  handleFormat()
}

const getContent = () => {
  const options2 = { indent_size: 0, space_in_empty_paren: false, end_with_newline: false }
  const simpleContent = beautify(content.value, options2)
  try {
    JSON.stringify(JSON.parse(simpleContent))
  } catch (error: any) {
    ElNotification({
      title: 'Error',
      message: error,
      type: 'error'
    })
    return 'illegal'
  }

  return JSON.stringify(JSON.parse(simpleContent))
}

defineExpose({
  content,
  getContent,
  setContent
})
</script>
