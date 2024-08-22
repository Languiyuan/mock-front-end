<!--
 * @Description: monaco editor
 * @Author: yinkaiyuan
 * @Date: 2024-08-20 22:16:45
 * @LastEditTime: 2024-08-20 23:54:21
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

const container = ref(null)
let editor = null
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
const setEditorContent = (content) => {
  if (editor) {
    editor.setValue(content)
  }
}

defineExpose({
  getEditorContent,
  setEditorContent
})
</script>

<style scoped>
.monaco-editor-container {
  height: 100%;
  width: 100%;
}
</style>
