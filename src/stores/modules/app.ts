import { defineStore } from 'pinia'
import { useNavigatorLanguage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

export type LanguageType = 'zh-CN' | 'en-US'
const useAppStore = defineStore(
  'app-store',
  () => {
    const i18n = useI18n()
    const { language: navigatorLanguage } = useNavigatorLanguage()
    const language = shallowRef<LanguageType>(
      navigatorLanguage.value?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US',
    )
    const changeLanguage = (lang: LanguageType) => {
      language.value = lang
    }

    watch(
      language,
      (lang) => {
        i18n.locale.value = lang
      },
      {
        immediate: true,
      },
    )

    return {
      language,
      changeLanguage,
    }
  },
  {
    persist: {
      pick: ['language'],
    },
  },
)
export default useAppStore
