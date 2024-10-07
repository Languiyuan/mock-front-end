<template>
  <el-dialog v-model="dialogFormVisible" title="函数编辑" width="840" :before-close="close">
    <div class="w-full h-80 mt-4">
      <Editor ref="editorRef" :value="funcContent" language="javascript"></Editor>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import Editor from '@/components/Editor.vue'
// import * as monaco from 'monaco-editor'

const $emit = defineEmits<{
  change: [string]
}>()

const funcContent = ref('')
const dialogFormVisible = ref(false)
const editorRef = ref()

const open = (content: string) => {
  dialogFormVisible.value = true
  funcContent.value = content
  nextTick(() => {
    editorRef.value.setEditorContent(funcContent.value)
  })
}

const close = () => {
  dialogFormVisible.value = false
}

const handleConfirm = () => {
  // dialogFormVisible.value = false
  // const editorInstance:monaco.editor.IStandaloneCodeEditor = editorRef.value.getEditorInstance()
  // const model = editorInstance.getModel()
  // const range = model?.getFullModelRange()

  // // 获取格式化选项，确保添加分号
  // const options = {
  //   tabSize: 2,
  //   insertSpaces: true,
  //   semicolons: true // 确保添加分号
  // }

  // // 获取格式化后的代码
  // const edits = model?.getFormattingEditsForRange(range, options)

  // if (edits) {
  //   editorInstance.executeEdits('', edits)
  // }
  const content = formatCodeWithSemicolons( editorRef.value.getEditorContent())
  console.log('content11111',content)
  $emit('change', editorRef.value.getEditorContent())
}

const formatCodeWithSemicolons = (code:string) => {
    // 将函数转换为字符串
    let funcString = code;

    // 正则表达式匹配需要添加分号的位置
    const semicolonPattern = /([^\s;{}])\s*([{}])/g; // 匹配非空白字符后面紧跟着 { 或 }

    // 在匹配的位置添加分号
    funcString = funcString.replace(semicolonPattern, '$1;$2');

    // 替换行末的单行语句
    funcString = funcString.replace(/([^\s;{}]+)(?=\n)/g, '$1;');

    // 确保最后不重复添加分号
    return funcString.endsWith(';') ? funcString : funcString + ';';
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
