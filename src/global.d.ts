/* Vite */
declare type Recordable<T = any> = Record<string, T>

declare interface ViteEnv {
  VITE_USER_NODE_ENV: 'development' | 'production' | 'test'
  VITE_GLOB_APP_TITLE: string
  VITE_PORT: number
  VITE_OPEN: boolean
  VITE_REPORT: boolean
  VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'gzip,brotli' | 'none'
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
  VITE_DROP_CONSOLE: boolean
  VITE_PWA: boolean
  VITE_PUBLIC_PATH: string
  VITE_API_URL: string
  VITE_PROXY: [string, string][]
}

interface ImportMetaEnv extends ViteEnv {
  __: unknown
}

/* __APP_INFO__ */
declare const __APP_INFO__: {
  pkg: {
    name: string
    version: string
    dependencies: Recordable<string>
    devDependencies: Recordable<string>
  }
  lastBuildTime: string
}

/* Generic Tools */
type ObjToKeyValUnion<T> = {
  [K in keyof T]: { key: K; value: T[K] }
}[keyof T]

type ObjToKeyValArray<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T]

declare module 'js-beautify'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
