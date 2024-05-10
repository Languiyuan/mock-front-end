import { defineStore } from 'pinia'
import { UserState, TokenData } from '@/stores/interface'
import piniaPersistConfig from '@/stores/piniaPersist'

export const useUserStore = defineStore({
  id: 'mock-user',
  state: (): UserState => ({
    accessToken: '',
    refreshToken: '',
    userInfo: { username: '', id: -1, isAdmin: false }
  }),
  getters: {},
  actions: {
    // Set Token
    setToken({ accessToken, refreshToken }: TokenData) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState['userInfo']) {
      this.userInfo = userInfo
    },
    // reset UserInfo login out
    resetInfo() {
      this.accessToken = ''
      this.refreshToken = ''
      this.userInfo = { username: '', id: -1, isAdmin: false }
    }
  },
  persist: piniaPersistConfig('mock-user')
})
