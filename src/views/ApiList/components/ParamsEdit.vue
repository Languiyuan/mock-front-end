<template>
  <el-dialog v-model="dialogVisible" append-to-body :before-close="close" title="参数配置（仅支持application/json）" width="860">
    <template #header>
      参数配置
      <el-tooltip class="box-item" effect="dark" content="仅支持application/json" placement="top">
        <el-button icon="Warning" size="small" circle />
      </el-tooltip>
    </template>

    <div v-if="$props.method === 'POST'">
      <p class="pb-1 font-bold">Body类型</p>
      <el-select v-model="bodyParamsType" placeholder="Select">
        <el-option label="object" value="object" />
        <el-option label="array" value="array" />
      </el-select>
    </div>

    <div class="mt-4" v-if="bodyParamsType === 'object' && $props.method === 'POST'">
      <p class="pb-1 font-bold">Body参数配置</p>

      <div class="max-h-60 scrollbar-container">
        <el-form
          v-for="(item, index) in bodyParamsFormRule"
          :ref="(el: refItem) => setFormRef(el, index, 'body')"
          :rules="formRules"
          :key="index + 'formParams'"
          :inline="true"
          :model="item"
          class="demo-form-inline"
        >
          <el-form-item label="参数名" style="margin-right: 24px; width: 230px" prop="name">
            <el-input v-model="item.name" placeholder="填写参数名" clearable />
          </el-form-item>
          <el-form-item label="参数类型" class="w-80" style="margin-right: 24px" prop="type">
            <el-select v-model="item.type" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="2" placeholder="选择参数类型">
              <el-option v-for="(o, i) in typeOptions" :key="i + 'type'" :label="o" :value="o" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否必传" style="margin-right: 24px">
            <el-switch v-model="item.required" />
          </el-form-item>
          <el-form-item>
            <el-button type="danger" icon="Delete" size="small" circle @click="handleDeleteBodyFromRow(index)" />
          </el-form-item>
        </el-form>

        <el-button class="block w-full mt-2" icon="Plus" @click="handleAddBodyFormRule">Add</el-button>
      </div>
    </div>

    <div class="mt-4">
      <p class="pb-1 font-bold">Query参数配置</p>

      <div class="max-h-60 scrollbar-container">
        <el-form
          v-for="(item, index) in queryParamsFormRule"
          :ref="(el: refItem) => setFormRef(el, index, 'query')"
          :rules="formRules"
          :key="index + 'formParams'"
          :inline="true"
          :model="item"
          class="demo-form-inline"
        >
          <el-form-item label="参数名" style="margin-right: 24px; width: 230px" prop="name">
            <el-input v-model="item.name" placeholder="填写参数名" clearable />
          </el-form-item>
          <el-form-item label="参数类型" class="w-80" style="margin-right: 24px" prop="type">
            <el-select v-model="item.type" disabled multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="2" placeholder="选择参数类型">
              <el-option v-for="(o, i) in typeOptions" :key="i + 'type'" :label="o" :value="o" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否必传" style="margin-right: 24px">
            <el-switch v-model="item.required" />
          </el-form-item>
          <el-form-item>
            <el-button type="danger" icon="Delete" size="small" circle @click="handleDeleteQueryFromRow(index)" />
          </el-form-item>
        </el-form>

        <el-button class="block w-full mt-2" icon="Plus" @click="handleAddQueryFormRule">Add</el-button>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ref, reactive } from 'vue'
import type { ComponentPublicInstance } from 'vue'
type refItem = Element | ComponentPublicInstance | FormInstance | null

const $props = defineProps<{
  method: string
}>()

const $emit = defineEmits<{
  confirm: [params: string]
}>()
const dialogVisible = ref(false)

const bodyParamsType = ref('object')

interface SingleParamsRule {
  name: string
  type: string[]
  required: boolean
}

interface Output {
  bodyParamsType: string
  bodyParams: SingleParamsRule[]
  queryParams: SingleParamsRule[]
}

const typeOptions = reactive(['string', 'number', 'null', 'undefined', 'array', 'object'])
const bodyParamsFormRule = ref<SingleParamsRule[]>([])
const handleAddBodyFormRule = () => {
  bodyParamsFormRule.value.push({ name: '', type: [], required: true })
}
const handleDeleteBodyFromRow = (index: number) => {
  bodyParamsFormRule.value.splice(index, 1)
}

const queryParamsFormRule = ref<SingleParamsRule[]>([])
const handleAddQueryFormRule = () => {
  queryParamsFormRule.value.push({ name: '', type: ['string'], required: true })
}
const handleDeleteQueryFromRow = (index: number) => {
  queryParamsFormRule.value.splice(index, 1)
}

interface RuleForm {
  name: string
  type: string[]
}

const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请填写参数名'))
  } else if (!/^[a-zA-Z0-9_-]{1,50}$/.test(value)) {
    callback(new Error('小于50且不允许包含特殊字符'))
  } else if (bodyParamsFormRule.value.filter((item: SingleParamsRule) => item.name === value).length > 1) {
    callback(new Error('参数名不允许重复'))
  } else {
    callback()
  }
}

const formRules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, validator: validateName, trigger: 'blur' }],
  type: [{ type: 'array', required: true, message: '请选择参数类型', trigger: 'change' }]
})

const oneValidate = async (formEl: FormInstance | undefined): Promise<boolean> => {
  if (!formEl) return false
  let flag = false
  await formEl.validate((valid) => {
    if (valid) {
      flag = true
      return true
    } else {
      return false
    }
  })

  return flag
}

// 存动态ref
const formRefMap: Record<string, refItem> = {}
const setFormRef = (el: refItem, index: number, type: string) => {
  if (el) {
    formRefMap[`formRef${index}${type}`] = el
  }
}

const confirm = async () => {
  let result: Promise<boolean>[] = []
  Object.values(formRefMap).forEach((item) => {
    result.push(oneValidate(item as FormInstance))
  })

  Promise.allSettled(result).then((res) => {
    if (res.findIndex((item) => (item.status === 'fulfilled' && item.value === false) || item.status === 'rejected') > -1) return
    const output: Output = {
      bodyParamsType: bodyParamsType.value,
      bodyParams:  bodyParamsType.value === 'array' || $props.method === 'GET' ? [] : bodyParamsFormRule.value,
      queryParams: queryParamsFormRule.value
    }

    $emit('confirm', JSON.stringify(output))
    close()
  })

  // submit
}

const handleImport = (rules: SingleParamsRule[]) => {
  bodyParamsType.value = 'object'
  bodyParamsFormRule.value = rules
}

const open = (paramsJson: string) => {
  dialogVisible.value = true
  if (!paramsJson) return

  const params: Output = JSON.parse(paramsJson)

  bodyParamsType.value = params.bodyParamsType
  bodyParamsFormRule.value = params.bodyParams
  queryParamsFormRule.value = params.queryParams
}

const close = () => {
  dialogVisible.value = false
  bodyParamsType.value = 'object'
  bodyParamsFormRule.value = []
  queryParamsFormRule.value = []
}

defineExpose({
  open,
  handleImport
})
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
.scrollbar-container {
  overflow: hidden auto;
  scrollbar-width: thin;
  scrollbar-color: #c0c4cc #f0f0f0;
  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 8px; /* 设置滚动条宽度 */
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c0c4cc; /* 设置滚动条拖动条颜色 */
    border-radius: 4px; /* 设置拖动条圆角 */
  }

  &::-webkit-scrollbar-track {
    background-color: #f0f0f0; /* 设置滚动条轨道颜色 */
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: #a6aaaf; /* 鼠标悬停时拖动条颜色 */
  }

  &:hover::-webkit-scrollbar-track {
    background-color: #e4e7eb; /* 鼠标悬停时轨道颜色 */
  }
}
</style>
