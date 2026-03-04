import { javascriptLanguage, localCompletionSource, snippets } from '@codemirror/lang-javascript'
import {
  defaultHighlightStyle,
  indentOnInput,
  LanguageSupport,
  syntaxHighlighting,
} from '@codemirror/language'
import {
  autocompletion,
  closeBrackets,
  completeFromList,
  type CompletionContext,
  type CompletionResult,
  ifNotIn,
} from '@codemirror/autocomplete'
import javascriptCompletions from './javascriptCompletions.ts'
import { keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'

const dontComplete = [
  'TemplateString',
  'String',
  'RegExp',
  'LineComment',
  'BlockComment',
  'VariableDefinition',
  'TypeDefinition',
  'Label',
  'PropertyDefinition',
  'PropertyName',
  'PrivatePropertyDefinition',
  'PrivatePropertyName',
  'JSXText',
  'JSXAttributeValue',
  'JSXOpenTag',
  'JSXCloseTag',
  'JSXSelfClosingTag',
  '.',
  '?.',
]
const kwCompletion = (name: string) => ({ label: name, type: 'keyword' })
const keywords =
  'break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield'
    .split(' ')
    .map(kwCompletion)
const javascriptSupport = new LanguageSupport(javascriptLanguage, [
  javascriptLanguage.data.of({
    autocomplete: ifNotIn(dontComplete, completeFromList(snippets.concat(keywords))),
  }),
  javascriptLanguage.data.of({
    autocomplete: localCompletionSource,
  }),
  javascriptLanguage.data.of({
    autocomplete: ifNotIn(dontComplete, (context: CompletionContext): CompletionResult | null => {
      const word = context.matchBefore(/\w*/)
      if (!word || (word.from === word.to && !context.explicit)) return null
      return {
        from: word.from,
        options: javascriptCompletions,
      }
    }),
  }),
  keymap.of([indentWithTab]),
  autocompletion(),
  closeBrackets(),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle),
])
export default javascriptSupport
