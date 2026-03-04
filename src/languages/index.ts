import { createI18n } from 'vue-i18n'
import en from './langs/en-US'
import zh from './langs/zh-CN'

const l18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zh,
    'en-US': en,
  },
})
export default l18n
