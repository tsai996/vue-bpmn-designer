import { createApp } from 'vue'
import pinia from '@/stores'
import I18n from '@/languages'
import App from './App.vue'
import '@/styles/index.scss'
import 'virtual:svg-icons-register'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { Icon } from '@iconify/vue'
import DisableDevtool from 'disable-devtool'

const app = createApp(App)
app.use(pinia).component('Iconify', Icon).use(I18n).mount('#app')

if (!['development'].includes(import.meta.env.MODE)) {
  DisableDevtool({
    // url: 'about:blank',
    timeOutUrl: 'about:blank',
    rewriteHTML: `<h3 style='position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);color: red;'>
  💢 检测到非法调试，请关闭后刷新重试！
  </h3>`,
  })
}
