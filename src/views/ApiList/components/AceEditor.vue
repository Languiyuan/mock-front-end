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
      <el-button :disabled="selectedText !== 'LMFunc'" color="#2563eb" size="small" plain @click="handleEditFunc">编辑函数</el-button>
    </div>
    <div class="flex-1 w-full">
      <v-ace-editor
        ref="aceRef"
        :key="editorKey"
        v-model:value="content"
        lang="json"
        :theme="aceTheme"
        style="height: 100%"
        :options="options"
      />
    </div>
    <RuleCustomFuncDialog ref="ruleCustomFuncDialogRef" @change="handleCustomFunc"></RuleCustomFuncDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick, onMounted } from 'vue'
import { VAceEditor } from 'vue3-ace-editor'
import './ace.config'
import type { Ace } from 'ace-builds'
import beautify from 'js-beautify'
import { ElMessage, ElNotification } from 'element-plus'
import RuleCustomFuncDialog from './RuleCustomFuncDialog.vue'
import { Range } from 'ace-builds'

const aceRef = ref()
const aceInstance = ref<Ace.Editor>()
const selectedText = ref('')

onMounted(() => {
  nextTick(() => {
    aceInstance.value = aceRef.value.getAceInstance()
    // 监听selectionChange事件
    aceInstance.value &&
      aceInstance.value.getSelection().on('changeSelection', function () {
        selectedText.value = aceInstance.value?.getSelectedText() || ''
      })
  })
})

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
    nextTick(() => {
      aceInstance.value = aceRef.value.getAceInstance()
      // 监听selectionChange事件
      aceInstance.value &&
        aceInstance.value.getSelection().on('changeSelection', function () {
          selectedText.value = aceInstance.value?.getSelectedText() || ''
        })
    })
  }
)
const aceTheme = ref('monokai')

const handleFormat = () => {
  const options1 = { indent_size: 2, space_in_empty_paren: true }

  content.value = beautify(content.value, options1)
}

const ruleCustomFuncDialogRef = ref()
const funcContentRange = reactive({
  row: -1,
  columnStart: 0,
  columnEnd: 0
})

// 编辑函数
const handleEditFunc = () => {
  let funcContent = getContentWithinBrackets()
  if (funcContent === null) {
    ElMessage.error('@LMFunc后需要有闭合的括号，如 @LMFunc()')
    return
  }

  let content = `
  // 函数内部禁止注释; 具体详见使用文档
  const LMFunc = (options) => {`
  funcContent.split('\\n').forEach((item) => {
    content += `${item.trim()}`
  })
  content += `}`

  // 格式化
  const options1 = { indent_size: 2, space_in_empty_paren: true }
  content = beautify(content, options1)
  ruleCustomFuncDialogRef.value.open(content)
}

// 自定义函数确认
const handleCustomFunc = (content: string) => {
  const options2 = {
    indent_size: 0,
    space_in_empty_paren: false,
    end_with_newline: false
  }
  const simpleContent = beautify(content, options2)
  try {
    JSON.parse(JSON.stringify(simpleContent))
    const funcCode = JSON.stringify(simpleContent)
    console.log('funcCode', extractFunctionBody(funcCode))

    const editor = aceInstance.value as Ace.Editor
    const doc = editor.getSession().getDocument()
    const replaceRange = new Range(funcContentRange.row, funcContentRange.columnStart, funcContentRange.row, funcContentRange.columnEnd)

    doc.replace(replaceRange, extractFunctionBody(funcCode) as string)

    ruleCustomFuncDialogRef.value.close()
  } catch (error) {
    ElMessage.error(error as string)
  }
}

// 提取函数体内容 从函数编辑器
const extractFunctionBody = (code: string) => {
  // 使用正则表达式匹配函数体
  const match = code.match(/const LMFunc\s*=\s*\(.*?\)\s*=>\s*{([^]*)}/)
  return match ? match[1].trim() : '' // 返回函数体内容并去掉首尾空白
}

// 获取函数内容  从mockRule 到 函数编辑dialog
const getContentWithinBrackets = () => {
  const editor = aceInstance.value as Ace.Editor
  let session = editor.getSession()
  let cursorPosition = editor.getCursorPosition()
  let lineNumber = cursorPosition.row
  let lineContent = session.getLine(lineNumber) // 获取当前行的内容
  funcContentRange.row = lineNumber

  let content = ''
  let openBrackets = 0

  // 从光标位置开始遍历当前行
  for (let i = cursorPosition.column; i < lineContent.length; i++) {
    let char = lineContent[i]
    // 第一次进入编辑的时候，双击光标会在前面
    if (content.length === 0 && char !== '(') {
      continue
    }

    content += char // 添加当前字符到内容中

    // 统计开始函数内容开始值
    if (content.length === 1) {
      funcContentRange.columnStart = i + 1
    }

    // 统计括号
    if (char === '(') {
      openBrackets++
    } else if (char === ')') {
      openBrackets--

      // 如果找到了匹配的闭合括号，结束循环
      if (openBrackets === 0) {
        funcContentRange.columnEnd = i
        return content.slice(1, -1) // 返回内容 去掉括号
      }
    }
  }

  // 没有找到匹配的闭合括号
  console.log('未找到闭合括号')
  return null
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
