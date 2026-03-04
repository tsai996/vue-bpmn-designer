import {
  defaultHighlightStyle,
  LanguageSupport,
  StreamLanguage,
  syntaxHighlighting,
} from '@codemirror/language'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { autocompletion } from '@codemirror/autocomplete'

const shellSupport = new LanguageSupport(StreamLanguage.define(shell), [
  autocompletion(),
  syntaxHighlighting(defaultHighlightStyle),
])
export default shellSupport
