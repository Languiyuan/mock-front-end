import './index.css'
import './assets/main.css'

import { createApp } from 'vue'
import pinia from './stores'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// element icons
import * as Icons from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
// register the element Icons component
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key as keyof typeof Icons])
})
app.use(ElementPlus)
app.use(pinia)
app.use(router)

app.mount('#app')
