<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import ProcessDesigner from '@/views/ProcessDesigner/index.vue'
import type { Language } from 'element-plus/es/locale'
import useAppStore, { type LanguageType } from '@/stores/modules/app.ts'

const { language } = useAppStore()
const languages: Record<LanguageType, Language> = {
  'zh-CN': zhCn,
  'en-US': en,
}
</script>

<template>
  <el-config-provider
    namespace="el"
    size="default"
    :locale="languages[language]"
    :empty-values="[undefined, null]"
  >
    <ProcessDesigner></ProcessDesigner>
  </el-config-provider>
</template>

<style scoped lang="scss">
#app {
  color: var(--el-text-color-primary);
}
</style>
