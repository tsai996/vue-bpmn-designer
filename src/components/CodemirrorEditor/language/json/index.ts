import {
  defaultHighlightStyle,
  indentOnInput,
  LanguageSupport,
  syntaxHighlighting,
} from '@codemirror/language'
import { jsonLanguage, jsonParseLinter } from '@codemirror/lang-json'
import { linter } from '@codemirror/lint'
import { closeBrackets } from '@codemirror/autocomplete'
import { EditorView } from '@codemirror/view'

const jsonSupport = new LanguageSupport(jsonLanguage, [
  linter((view: EditorView) => {
    const text = view.state.doc.toString()
    const trimmed = text.trim()
    if (!trimmed) {
      return []
    }
    return jsonParseLinter()(view)
  }),
  closeBrackets(),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle),
])
export default jsonSupport
