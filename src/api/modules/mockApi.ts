import { PORT1 } from '@/api/config/servicePort'
import http from '@/api'
import { MockApi, ResPage } from '../interface'

export const apiListApi = (params: MockApi.ReqApiList) => {
  return http.post<ResPage<MockApi.ResApiDetail>>(PORT1 + '/api/query', params)
}

export const apiAddApi = (params: MockApi.ReqAddApi) => {
  return http.post<string>(PORT1 + '/api/add', params)
}

export const apiEditApi = (params: MockApi.ReqEditApi) => {
  return http.post<string>(PORT1 + '/api/edit', params)
}

export const apiBatchDeleteApi = (params: MockApi.ReqBatchDeleteApi) => {
  return http.post<string>(PORT1 + '/api/batchRemove', params)
}

export const apiMoveApi = (params: MockApi.ReqMoveApi) => {
  return http.post<string>(PORT1 + '/api/moveApi', params)
}

export const apiDetailApi = (params: MockApi.ReqApiDetail) => {
  return http.post<MockApi.ResApiDetail>(PORT1 + '/api/queryApiDetail', params)
}

export const apiHistoryListApi = (params: MockApi.ReqApiHistory) => {
  return http.post<ResPage<MockApi.ResApiHistory>>(PORT1 + '/api/queryHistory', params)
}

// 导出项目所有接口 json文件
export const exportProjectAllApi = (params: { projectId: number }) => {
  return http.download(PORT1 + '/api/exportProjectAllApi', params)
}
