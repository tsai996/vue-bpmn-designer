import I18n from '@/languages'

export const customTranslate = (template: string, replacements: Record<string, string> = {}) => {
  const { t, te } = I18n.global
  const i18nKey = `bpmn.${template}`
  const result = te(i18nKey) ? t(i18nKey) : template
  return result.replace(/{([^}]+)}/g, function (_, key) {
    return replacements[key] || '{' + key + '}'
  })
}

export default {
  translate: ['value', customTranslate],
}
