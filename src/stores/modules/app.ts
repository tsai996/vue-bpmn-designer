import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'

export type LanguageType = 'zh-CN' | 'en-US'
const useAppStore = defineStore('app-store', () => {
  const i18n = useI18n()
  const language = ref<LanguageType>('zh-CN')
  const changeLanguage = (lang: LanguageType) => {
    i18n.locale.value = lang
    language.value = lang
  }
  const sysLanguage = navigator.language
  if (sysLanguage.includes('zh')) {
    changeLanguage('zh-CN')
  } else {
    changeLanguage('en-US')
  }
  onMounted(() => {
    changeLanguage(language.value)
  })
  return {
    language,
    changeLanguage,
  }
})
export default useAppStore
