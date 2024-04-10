import { PORT1 } from '@/api/config/servicePort'
import http from '@/api'
import { MockApi, ResPage } from '../interface'

export const apiListApi = (params: MockApi.ReqApiList) => {
  return http.post<ResPage<MockApi.ResApiDetail>>(PORT1 + '/api/query', params)
}
