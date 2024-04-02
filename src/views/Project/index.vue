<template>
  <el-tabs v-model="curTag" :tab-position="tabPosition" class="tabs">
    <el-tab-pane label="所有项目" name="all">所有项目</el-tab-pane>
    <el-tab-pane label="我创建的" name="create">我创建的</el-tab-pane>
    <el-tab-pane label="我加入的" name="join">我加入的</el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { EpPropMergeType } from 'element-plus/es/utils'

const tabPosition = ref<EpPropMergeType<StringConstructor, 'left' | 'top' | 'bottom' | 'right', unknown> | undefined>('top')

const curTag = ref('create')
watchEffect(() => {})
</script>

<style lang="scss" scoped>
.tabs {
  height: 100%;
}
.el-tabs__content {
  height: calc(100% - 54px);
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
</style>
