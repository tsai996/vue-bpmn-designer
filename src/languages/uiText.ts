import I18n from '@/languages'
import uiTextEn from '@/languages/langs/en-US/uiText'

const uiTextEntries = Object.entries(uiTextEn).sort(([left], [right]) => right.length - left.length)

export const translateUi = (source: string, english?: string) =>
  I18n.global.locale.value === 'en-US' ? english || uiTextEn[source] || source : source

export const translateUiHtml = (source: string) => {
  if (I18n.global.locale.value !== 'en-US') return source
  return uiTextEntries
    .reduce((text, [chinese, english]) => text.split(chinese).join(english), source)
    .split('。')
    .join('.')
    .split('，')
    .join(', ')
    .split('：')
    .join(': ')
}
