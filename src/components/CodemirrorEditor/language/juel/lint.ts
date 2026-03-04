import { type Diagnostic, linter } from '@codemirror/lint'
import { EditorView } from '@codemirror/view'

export const juelLinter = linter((view: EditorView): Diagnostic[] => {
  const text = view.state.doc.toString()
  const trimmed = text.trim()
  const diagnostics: Diagnostic[] = []
  if (!trimmed) {
    return diagnostics
  }
  const match = trimmed.match(/^([#$])\{([\s\S]*)\}$/)
  if (!match) {
    diagnostics.push({
      from: 0,
      to: text.length,
      severity: 'error',
      message: '表达式缺少 ${...} 包裹内容',
    })
  } else {
    const inner = match[2].trim()
    if (!inner) {
      diagnostics.push({
        from: 0,
        to: text.length,
        severity: 'error',
        message: '表达式不能为空',
      })
    }
  }
  return diagnostics
})
