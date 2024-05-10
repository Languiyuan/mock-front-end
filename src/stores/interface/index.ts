/* tokenData */
export interface TokenData {
  accessToken: string
  refreshToken: string
}

/* UserState */
export interface UserState extends TokenData {
  userInfo: { username: string; id: number; isAdmin: boolean }
}
