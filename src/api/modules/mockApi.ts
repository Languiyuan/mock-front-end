import { PORT1 } from '@/api/config/servicePort'
import http from '@/api'
import { MockApi, ResPage, ResultData } from '../interface'

export const apiListApi = (params: MockApi.ReqApiList) => {
  return http.post<ResPage<MockApi.ResApiDetail>>(PORT1 + '/api/query', params)
}

export const apiAddApi = (params: MockApi.ReqAddApi) => {
  return http.post<ResultData<string>>(PORT1 + '/api/add', params)
}

export const apiEditApi = (params: MockApi.ReqEditApi) => {
  return http.post<ResultData<string>>(PORT1 + '/api/edit', params)
}

export const apiBatchDeleteApi = (params: MockApi.ReqBatchDeleteApi) => {
  return http.post<ResultData<string>>(PORT1 + '/api/batchRemove', params)
}

export const apiMoveApi = (params: MockApi.ReqMoveApi) => {
  return http.post<ResultData<string>>(PORT1 + '/api/moveApi', params)
}
