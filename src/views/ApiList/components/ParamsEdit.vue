<template>
  <el-dialog v-model="dialogVisible" append-to-body title="参数配置（仅支持application/json）" width="500">
    <div>
      <p class="pb-1">参数类型</p>
      <el-select v-model="paramsType" placeholder="Select">
        <el-option label="Object" value="Object" />
        <el-option label="Array" value="Array" />
      </el-select>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dialogVisible = ref(false)

enum ParamsTypeEnum {
  Object = 'Object',
  Array = 'Array'
}

const paramsType = ref<ParamsTypeEnum>(ParamsTypeEnum.Object)

const open = () => {
  dialogVisible.value = true
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
