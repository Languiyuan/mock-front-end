// 请求响应参数（不包含data）
export interface Result {
  code: string
  message: string
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T
}

// 分页响应参数
export interface ResPage<T> {
  list: T[]
  pageNo: number
  pageSize: number
  total: number
}

// 分页请求参数
export interface ReqPage {
  pageNum: number
  pageSize: number
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string
    password: string
  }

  export interface ReqRefresh {
    refreshToken: string
  }
  export interface ResLogin {
    accessToken: string
    refreshToken: string
    userInfo: Record<string, any>
  }

  export interface ResRefresh {
    accessToken: string
    refreshToken: string
  }
  export interface ResAuthButtons {
    [key: string]: string[]
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string
    gender: number
    idCard: string
    email: string
    address: string
    createTime: string[]
    status: number
  }
  export interface ResUserList {
    id: string
    username: string
    gender: number
    user: { detail: { age: number } }
    idCard: string
    email: string
    address: string
    createTime: string
    status: number
    avatar: string
    photo: any[]
    children?: ResUserList[]
  }
  export interface ResStatus {
    userLabel: string
    userValue: number
  }
  export interface ResGender {
    genderLabel: string
    genderValue: number
  }
  export interface ResDepartment {
    id: string
    name: string
    children?: ResDepartment[]
  }
  export interface ResRole {
    id: string
    name: string
    children?: ResDepartment[]
  }
}

// 项目模块
export namespace Project {
  export interface ProjectReq {
    type: string
  }

  export interface AddProjectReq {
    name: string
    baseUrl: string
    description: string
  }

  export interface DeleteProjectReq {
    projectId: number
  }

  export interface EditProjectReq extends AddProjectReq, DeleteProjectReq {}

  export interface ResPorjectDetail {
    baseUrl: string
    createUserId: number
    description: string
    id: number
    isDeleted: number
    name: string
    sign: string
    updateTime: Date | string
    createTime: Date | string
    updateUserId: number
    createUsername?: String
    members?: { id: number; name: string }[]
  }
}

export namespace MockApi {
  export interface ReqApiList {
    projectId: number
    folderId?: number | null
    name?: string
    url?: string
    pageNo: number
    pageSize: number
  }
  export interface ResApiDetail {
    id: number
    projectId: number
    projectSign: string
    createUserId: number
    updateUserId: number
    folderId: number | null
    name: string
    url: string
    mockRule: string
    method: string
    delay: number
    description: string
    on: number
    isDeleted: number
    createTime: Date | string
    updateTime: Date | string
  }

  enum OnStatus {
    Off = 0,
    On = 1
  }
  export interface ReqAddApi {
    projectId: number
    folderId: number | null
    name: string
    url: string
    mockRule: string
    method: string
    delay: number
    description?: string
    on: OnStatus
  }

  export interface ReqEditApi extends ReqAddApi {
    id: number
  }

  export interface ReqBatchDeleteApi {
    projectId: number
    ids: number[]
  }
}
