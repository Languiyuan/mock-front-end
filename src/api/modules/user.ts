import { User } from '@/api/interface/index'
import { PORT1 } from '@/api/config/servicePort'
import http from '@/api'

/**
 * @name 用户管理模块
 */
// 模糊搜索获取用户 by username
export const findUserByUsernameApi = (params: { username: string }) => {
  return http.post<User.ResUsersByUsername[]>(PORT1 + `/user/findUserByUsername`, params)
}

// 获取用户列表
// export const getUserList = (params: User.ReqUserParams) => {
//   return http.post<ResPage<User.ResUserList>>(PORT1 + `/user/list`, params)
// }

// // 新增用户
// export const addUser = (params: { id: string }) => {
//   return http.post(PORT1 + `/user/add`, params)
// }

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
