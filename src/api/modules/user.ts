import { User, Project } from '@/api/interface/index'
import { PORT1 } from '@/api/config/servicePort'
import http from '@/api'
import { ResPage } from '../interface/index'

/**
 * @name 用户管理模块
 */
// 模糊搜索获取用户 by username
export const findUserByUsernameApi = (params: { username: string }) => {
  return http.post<User.ResUsersByUsername[]>(PORT1 + `/user/findUserByUsername`, params)
}

// 更新密码
export const updateUserPasswordApi = (params: { password: string }) => {
  return http.post<string>(PORT1 + `/user/updatePassword`, params)
}

// 获取用户列表
export const getUserListApi = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(PORT1 + `/user/admin/getAllUsers`, params)
}

// 冻结用户
export const freezeApi = (params: { userId: number }) => {
  return http.post<string>(PORT1 + `/user/admin/freeze`, params)
}

// 解冻用户
export const unfreezeApi = (params: { userId: number }) => {
  return http.post<string>(PORT1 + `/user/admin/unfreeze`, params)
}

// 管理员获取所有的项目
export const getAllProjectApi = (params: Project.ReqProjectList) => {
  return http.post<ResPage<Project.ResPorjectDetail>>(PORT1 + '/user/admin/getAllProject', params)
}

// 新增用户
export const registerApi = (params: User.ReqRegister) => {
  return http.post<string>(PORT1 + `/user/register`, params)
}

// // 批量添加用户
// export const BatchAddUser = (params: FormData) => {
//   return http.post(PORT1 + `/user/import`, params)
// }

// // 编辑用户
// export const editUser = (params: { id: string }) => {
//   return http.post(PORT1 + `/user/edit`, params)
// }

// // 删除用户
// export const deleteUser = (params: { id: string[] }) => {
//   return http.post(PORT1 + `/user/delete`, params)
// }

// // 重置用户密码
// export const resetUserPassWord = (params: { id: string }) => {
//   return http.post(PORT1 + `/user/rest_password`, params)
// }
