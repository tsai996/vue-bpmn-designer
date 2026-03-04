import {
  autocompletion,
  closeBrackets,
  type Completion,
  type CompletionContext,
  type CompletionResult,
  ifNotIn,
} from '@codemirror/autocomplete'
import JuelCompletions from './juelCompletions.ts'
import { juelLinter } from '../juel/lint.ts'
import {
  defaultHighlightStyle,
  LanguageSupport,
  StreamLanguage,
  syntaxHighlighting,
} from '@codemirror/language'

const juelLanguage = StreamLanguage.define({
  name: 'juel',
  startState() {
    return { inExpr: false }
  },
  token(stream, state) {
    if (stream.eatSpace()) return null
    if (stream.match(/^"([^"\\]|\\.)*"/)) return 'string'
    if (stream.match(/^'([^'\\]|\\.)*'/)) return 'string'
    if (stream.match(/^[0-9]+(\.[0-9]+)?/)) return 'number'
    if (stream.match(/^(==|!=|&&|\|\||[<>!+\-*\/%?:=])/)) return 'operator'
    stream.next()
    return null
  },
  languageData: {
    closeBrackets: { brackets: ['(', ')', '[', ']', '{', '}', '"', "'", '${', '#{'] },
    indentOnInput: /^\s*[\}\]]$/,
    commentTokens: { line: '//', block: { open: '/*', close: '*/' } },
    wordChars: '$:#',
  },
})
const dontComplete = [
  'string', // 避免在普通字符串中补全（非 EL 表达式）
  'RegExp', // 避免在正则中触发
  '.', // 属性访问符后一般不补关键字
  '?.', // 可选链属性后不补关键字
]
interface Config {
  completions?: Completion[]
}
const juelSupport = (config?: Config) => {
  return new LanguageSupport(juelLanguage, [
    autocompletion({
      override: [
        ifNotIn(dontComplete, (context: CompletionContext): CompletionResult | null => {
          const word = context.matchBefore(/[\w:]+$/)
          if (!word || (word.from === word.to && !context.explicit)) return null
          return {
            from: word.from,
            options: [...JuelCompletions, ...(config?.completions || [])],
          }
        }),
      ],
    }),
    syntaxHighlighting(defaultHighlightStyle),
    closeBrackets(),
    juelLinter,
  ])
}
export default juelSupport
