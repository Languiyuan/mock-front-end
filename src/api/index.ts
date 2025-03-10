import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { ResultData } from '@/api/interface'
import { ResultEnum } from '@/api/enums/httpEnum'
import { checkStatus } from './helper/checkStatus'
import { useUserStore } from '@/stores/modules/user'

import router from '@/router'
import { refreshApi } from './modules/login'

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  noLoading?: boolean
}

const config = {
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL: import.meta.env.VITE_API_URL as string,
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true
}

class RequestHttp {
  service: AxiosInstance
  public constructor(config: AxiosRequestConfig) {
    // instantiation
    this.service = axios.create(config)

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        const userStore = useUserStore()

        // 当前请求不需要显示 loading，在 api 服务中通过指定的第三个参数: { noLoading: true } 来控制
        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set('authorization', `Bearer ${userStore.accessToken}`)
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    interface PendingTask {
      config: AxiosRequestConfig
      resolve: Function
    }
    let refreshing = false
    let queue: PendingTask[] = []
    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      async (response: AxiosResponse) => {
        const { data } = response

        // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          ElMessage.error(data.message)
          return Promise.reject(data)
        }
        // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        return data
      },
      async (error: AxiosError) => {
        const { response } = error as { response: AxiosResponse }

        const userStore = useUserStore()
        // 登陆失效 如果登录失效，是会到error中  response可能是undefined
        if (response?.data?.code == ResultEnum.OVERDUE) {
          // userStore.setToken('')
          if (response.config.url?.indexOf('/user/refresh') === -1) {
            // 不是refresh的请求才能推进队列
            if (refreshing) {
              return new Promise((resolve) => {
                queue.push({
                  config: response?.config,
                  resolve
                })
              })
            }

            refreshing = true
            const { data } = await refreshApi({ refreshToken: userStore.refreshToken })
            refreshing = false
            if (data.accessToken && data.refreshToken) {
              userStore.setToken({ accessToken: data.accessToken, refreshToken: data.refreshToken })
              response.config.headers.set('authorization', `Bearer ${userStore.accessToken}`)
              // 将推入队列中的请求也resolve
              queue.forEach(async ({ config, resolve }) => {
                resolve(this.service(config))
              })
              // clear the queue
              queue = []
              // 重新请求原来的接口
              return this.service(response.config)
            }
          }
          // 如果refreshToken也失效  clear the queue
          queue = []
          userStore.setToken({ accessToken: '', refreshToken: '' })
          console.log('-------------')
          router.replace('/login')
          // ElMessage.error('登录失效')
          if (response) checkStatus(response.status)

          return Promise.reject(response.data)
        }
        // 请求超时 && 网络错误单独判断，没有 response
        if (error.message.indexOf('timeout') !== -1) ElMessage.error('请求超时！请您稍后重试')
        if (error.message.indexOf('Network Error') !== -1) ElMessage.error('网络错误！请您稍后重试')
        // 根据服务器响应的错误状态码，做不同的处理
        // if (response) checkStatus(response.status)
        ElMessage.error(response.data.data)
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        if (!window.navigator.onLine) router.replace('/500')
        return Promise.reject(error)
      }
    )
  }

  /**
   * @description 常用请求方法封装
   */
  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ..._object })
  }
  post<T>(url: string, params?: object | string, _object = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, _object)
  }
  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, _object)
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ..._object })
  }
  download(url: string, params?: object, _object = {}): Promise<Blob> {
    return this.service.post(url, params, { ..._object, responseType: 'blob' })
  }
}

export default new RequestHttp(config)
