import { PORT1 } from '@/api/config/servicePort'
import http from '@/api'
import { Project, Folder } from '../interface'

// get projectList
export const projectListApi = (params: Project.ProjectReq) => {
  return http.post<Project.ResPorjectDetail[]>(PORT1 + '/project/list', params)
}

export const addProjectApi = (params: Project.AddProjectReq) => {
  return http.post<string>(PORT1 + '/project/add', params)
}

export const deleteProjectApi = (params: Project.DeleteProjectReq) => {
  return http.post<string>(PORT1 + '/project/delete', params)
}

export const editProjectApi = (params: Project.EditProjectReq) => {
  return http.post<string>(PORT1 + '/project/edit', params)
}

export const getProjectDetailApi = (params: Project.DeleteProjectReq) => {
  return http.get<Project.ResPorjectDetail>(PORT1 + '/project/detail', params)
}

// Folder
export const addFolderApi = (params: Folder.AddFolderReq) => {
  return http.post<Folder.AddFolderRes>(PORT1 + '/project/addFolder', params)
}

export const deleteFolderApi = (params: Folder.DeleteFolderReq) => {
  return http.post<string>(PORT1 + '/project/removeFolder', params)
}

export const editFolderApi = (params: Folder.EditFolderReq) => {
  return http.post<string>(PORT1 + '/project/editFolder', params)
}

export const folderListApi = (params: Folder.GetFolderListReq) => {
  return http.post<Folder.FolderDetail[]>(PORT1 + '/project/queryFolderList', params)
}
