import {
  defaultHighlightStyle,
  indentOnInput,
  LanguageSupport,
  StreamLanguage,
  syntaxHighlighting,
} from '@codemirror/language'
import { groovy } from '@codemirror/legacy-modes/mode/groovy'
import {
  autocompletion,
  closeBrackets,
  completeFromList,
  type CompletionContext,
  type CompletionResult,
  ifNotIn,
} from '@codemirror/autocomplete'
import { keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import javascriptCompletions from '@/components/CodemirrorEditor/language/javascript/javascriptCompletions.ts'

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
  `abstract as assert boolean break byte case catch char class const continue def default do double else enum extends
 final finally float for goto if implements import in instanceof int interface long native new package private protected public return short static strictfp
  super switch synchronized threadsafe throw throws trait transient try void volatile while`
    .split(' ')
    .map(kwCompletion)
const groovySupport = new LanguageSupport(StreamLanguage.define(groovy), [
  autocompletion({
    override: [
      ifNotIn(dontComplete, (context: CompletionContext): CompletionResult | null => {
        const word = context.matchBefore(/\w*/)
        if (!word || (word.from === word.to && !context.explicit)) return null
        return {
          from: word.from,
          options: javascriptCompletions,
        }
      }),
      ifNotIn(dontComplete, completeFromList(keywords)),
    ],
  }),
  keymap.of([indentWithTab]),
  closeBrackets(),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle),
])
export default groovySupport
