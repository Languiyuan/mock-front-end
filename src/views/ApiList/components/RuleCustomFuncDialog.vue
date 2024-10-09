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
  $emit('change', editorRef.value.getEditorContent())
}

defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
