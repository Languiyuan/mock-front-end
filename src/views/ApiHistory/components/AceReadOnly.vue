<template>
  <div class="h-48 w-full">
    <v-ace-editor v-model:value="content" lang="json" :theme="aceTheme" style="height: 100%" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { VAceEditor } from 'vue3-ace-editor'
import '../../ApiList/components/ace.config'
import type { Ace } from 'ace-builds'
import beautify from 'js-beautify'

const $props = defineProps<{
  mockRule: string
}>()
const content = ref('')

watch(
  () => $props.mockRule,
  () => {
    const options1 = { indent_size: 2, space_in_empty_paren: true }
    content.value = beautify($props.mockRule, options1)
  },
  {
    immediate: true
  }
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
  readOnly: true, // 是否可编辑
  newLineMode: 'windows' // 换行风格
  // minLines: 10, // 最小行数，minLines和maxLines同时设置之后，可以不用给editor再设置高度
  // maxLines: 50, // 最大行数
})

const aceTheme = ref('monokai')
// const handleFormat = () => {
//   const options1 = { indent_size: 2, space_in_empty_paren: true }

//   // content.value = beautify(JSON.stringify(JSON.parse(content.value)), options)
//   content.value = beautify(content.value, options1)
// }
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
