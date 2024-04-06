<template>
  <div ref="projectContainer" class="w-full h-full overflow-hidden">
    <div class="relative flex items-center justify-between">
      <el-tabs v-model="curTag" :tab-position="tabPosition" class="w-full h-10">
        <el-tab-pane label="所有项目" name="all"></el-tab-pane>
        <el-tab-pane label="我创建的" name="create"></el-tab-pane>
        <el-tab-pane label="我加入的" name="join"></el-tab-pane>
      </el-tabs>

      <div class="absolute top-0 right-0 flex items-center">
        <el-input v-model="searchInput" class="!w-72 mr-5" placeholder="请输入项目名称或baseUrl" suffix-icon="Search" />
        <el-button type="primary" @click="handleAddProject">新增项目</el-button>

        <AddProjectDialog ref="addProjectDialog" @success="getProjectList"></AddProjectDialog>
      </div>
    </div>

    <div class="h-[calc(100%_-_40px)] pt-4 scrollbar-container" v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="colSpan" v-for="(item, index) in projectList" :key="'project' + index">
          <el-card class="min-w-48 mb-5 cursor-pointer hover:translate-y-[-0.5rem]" shadow="hover">
            <template #header>
              <div class="flex items-center">
                <div class="flex-1 text-e text-[18px] font-bold">
                  <span :title="item.name">{{ item.name }}</span>
                </div>
                <el-icon><ArrowRight /></el-icon>
              </div>
            </template>

            <div class="min-h-28">
              <p class="text-e pb-1" :title="item.baseUrl">{{ item.baseUrl }}</p>
              <p class="text-e pb-1" :title="item.createTime.toDateString">{{ formatTime(item.createTime) }}</p>
              <p class="line-clamp-2 pb-1" :title="item.description">{{ item.description }}</p>
            </div>

            <template #footer>
              <div class="flex items-center">
                <div class="h-12 text-base flex-1 flex items-center justify-center hover:bg-gray-100" @click="handleDelete(item)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </div>
                <div class="h-12 text-base flex-1 flex items-center justify-center hover:bg-gray-100">
                  <el-icon>
                    <Setting />
                  </el-icon>
                </div>
              </div>
            </template>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { EpPropMergeType } from 'element-plus/es/utils'
import { projectListApi, deleteProjectApi } from '../../api/modules/project'
import { Project } from '../../api/interface/index'
import { formatTime } from '@/utils/index'
import AddProjectDialog from '@/views/Project/components/AddProjectDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const tabPosition = ref<EpPropMergeType<StringConstructor, 'left' | 'top' | 'bottom' | 'right', unknown> | undefined>('top')

// * 获取项目列表
const loading = ref(false)
const curTag = ref('all')
const projectList = ref<Project.ResPorjectDetail[]>([])
const projectListBuffer = ref<Project.ResPorjectDetail[]>([])
const getProjectList = async () => {
  try {
    loading.value = true
    projectList.value = []
    projectListBuffer.value = []
    const { data } = await projectListApi({ type: curTag.value })
    projectList.value = data
    projectListBuffer.value = data
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  getProjectList()
})
watch(
  () => curTag.value,
  () => {
    searchInput.value = ''
    getProjectList()
  }
)

// * 添加项目
const addProjectDialog = ref()
const handleAddProject = () => {
  addProjectDialog.value.open()
}

// * 删除项目
const deleteProject = async (projectId: number) => {
  const { data } = await deleteProjectApi({ projectId })
  ElMessage({
    type: 'success',
    message: data
  })
}
const handleDelete = (project: Project.ResPorjectDetail) => {
  const regex = new RegExp(`^${project.name}$`)
  ElMessageBox.prompt('请输入项目名称确认删除', '删除项目', {
    confirmButtonText: '确认',
    // cancelButtonText: '取消',
    inputPattern: regex,
    inputErrorMessage: '项目名称错误'
  })
    .then(async () => {
      await deleteProject(project.id)
      await getProjectList()
    })
    .catch(() => {
      // ElMessage({
      //   type: 'info',
      //   message: 'Input canceled'
      // })
    })
}

// * 搜索项目
const searchInput = ref('')
watch(searchInput, () => {
  projectList.value = projectListBuffer.value.filter((item) => {
    return item.name.includes(searchInput.value) || item.baseUrl.includes(searchInput.value)
  })
})

// * 一行显示多少个card
const colSpan = ref(6)
onMounted(() => {
  window.addEventListener('resize', handleChangeColSpan)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleChangeColSpan)
})

const handleChangeColSpan = () => {
  if (window.innerWidth > 1100) {
    colSpan.value = 6
  } else if (window.innerWidth <= 1100 && window.innerWidth >= 750) {
    colSpan.value = 8
  } else {
    colSpan.value = 12
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  .el-card__footer {
    padding: 0;
  }
  .el-card__body {
    padding: 16px 20px;
  }
}

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
