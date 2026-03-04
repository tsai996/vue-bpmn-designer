import { HighlightStyle, StreamLanguage, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

export const juelLanguage = StreamLanguage.define({
  name: 'juel',
  token: (stream) => {
    if (stream.match(/\$\{[^}]+\}/) || stream.match(/#\{[^}]+\}/)) {
      return 'juel-expression'
    }
    stream.next()
    return null
  },
  languageData: {},
})

export const juelHighlight = syntaxHighlighting(
  HighlightStyle.define([
    { tag: t.string, color: '#a31515' },
    { tag: t.number, color: '#098658' },
    { tag: t.variableName, color: '#0070f3' },
    { tag: t.operator, color: '#fa8d0c' },
    { tag: t.special(t.brace), color: '#d73a49' }, // 可选方式
    { tag: t.meta, color: '#d73a49' }, // 另一种方式
    { tag: t.keyword, color: '#d73a49' }, // 默认 keyword
    { tag: t.annotation, color: '#d73a49' }, // 或者你绑定 delimiter -> annotation
  ]),
)
