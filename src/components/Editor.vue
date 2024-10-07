<!--
 * @Description: monaco editor
 * @Author: yinkaiyuan
 * @Date: 2024-08-20 22:16:45
 * @LastEditTime: 2024-08-31 16:45:48
 * @LastEditors: yinkaiyuan
-->
<template>
  <div ref="container" class="monaco-editor-container" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import * as monaco from 'monaco-editor'

// issues resolve Unexpected usage: https://github.com/microsoft/monaco-editor/issues/4026
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

const $props = defineProps({
  value: String,
  language: {
    type: String,
    default: 'javascript'
  }
})

const initContent = ref('')
const container = ref(null)
let editor: monaco.editor.IStandaloneCodeEditor

// const editor = ref<monaco.editor.IStandaloneCodeEditor>()
onMounted(() => {
  window.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === 'json') {
        return new jsonWorker()
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker()
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker()
      }
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker()
      }
      return new editorWorker()
    }
  }

  nextTick(() => {
    if (container.value) {
      editor = monaco.editor.create(container.value, {
        value: $props.value,
        language: $props.language,
        theme: 'vs',
        minimap: {
          enabled: false // 关闭缩略图
        }
      })
      if (editor && initContent.value) {
        editor.setValue(initContent.value)
      }
    }
  })
})

// 获取编辑器内容
const getEditorContent = () => {
  if (editor) {
    const content = editor.getValue()
    return content
  }
}

// 设置编辑器内容
const setEditorContent = (content: string) => {
  initContent.value = content
  if (editor) {
    editor.setValue(content)
  }
}
/**
 * 在光标位置或选区插入文本
 * @param text 要插入的文本
 */
const insertText = (text: string) => {
  const curSelection: monaco.Selection | null = editor.getSelection() // 选择的文本范围或光标的当前位置

  if (!curSelection) return

  const { selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn } = curSelection
  // 在光标位置插入文本
  editor.executeEdits('', [
    {
      range: new monaco.Range(selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn),
      text, // 插入的文本
      forceMoveMarkers: true
    }
  ])
  // 核心 设置光标的位置
  editor.setPosition({ column: positionColumn + text.length, lineNumber: selectionStartLineNumber })

  editor.focus() // 插入完文本 需要聚焦下光标
}

const  getEditorInstance = () => {
  return editor
}

defineExpose({
  getEditorContent,
  setEditorContent,
  insertText,
  getEditorInstance
})
</script>

<style scoped>
.monaco-editor-container {
  height: 100%;
  width: 100%;
}
</style>
