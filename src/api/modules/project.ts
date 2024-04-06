import { PORT1 } from '@/api/config/servicePort'
import http from '@/api'
import { Project } from '../interface'

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
