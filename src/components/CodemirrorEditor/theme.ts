import { EditorView } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'

const baseTheme = EditorView.theme({
  '&': {
    padding: '1px 1px 1px 0',
    color: 'var(--el-text-color-regular)',
    backgroundColor: 'var(--el-bg-color)',
  },
  '.cm-completionInfo': {
    borderRadius: 'var(--el-border-radius-base)',
  },
  '.cm-completionInfo-left': {
    right: '101% !important',
  },
  '.cm-completionInfo-right': {
    left: '101% !important',
  },
  '& .cm-content': {
    padding: '0px',
    caretColor: 'var(--el-color-primary)',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'var(--el-color-primary)',
  },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
    {
      backgroundColor: 'var(--el-color-primary-light-5)',
    },
  '.cm-tooltip': {
    border: 'none',
    backgroundColor: 'var(--el-fill-color-light)',
    boxShadow: 'var(--el-box-shadow)',
  },
  '.cm-tooltip .cm-tooltip-arrow:before': {
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  '.cm-tooltip .cm-tooltip-arrow:after': {
    borderTopColor: 'var(--el-fill-color-light)',
    borderBottomColor: 'var(--el-fill-color-light)',
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: 'var(--el-color-primary-light-8)',
      color: 'var(--el-text-color-primary)',
    },
  },
  '.cm-gutters': {
    backgroundColor: 'var(--el-fill-color-lighter)',
    // color: '#7d8799',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--el-color-primary-light-8)',
  },
  '.cm-activeLine': { backgroundColor: '#6699ff0b' },
  '& .cm-line': {
    padding: '0 6px',
  },
  '&.cm-editor.cm-focused': {
    outline: 'none',
  },
  '& .cm-completionInfo': {
    whiteSpace: 'pre-wrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '&.cm-editor': {
    height: '100%',
  },
  // 不要为自定义HTML换行空格
  '& .cm-completionInfo > *': {
    whiteSpace: 'normal',
  },
  '& .cm-completionInfo ul': {
    margin: 0,
    paddingLeft: '15px',
  },
  '& .cm-completionInfo pre': {
    marginBottom: 0,
    whiteSpace: 'pre-wrap',
  },
  '& .cm-completionInfo p': {
    marginTop: 0,
  },
  '& .cm-completionInfo p:not(:last-of-type)': {
    marginBottom: 0,
  },
})
const baseHighlightStyle = syntaxHighlighting(
  HighlightStyle.define([
    {
      tag: tags.keyword,
      color: 'var(--codemirror-violet-color)',
    },
    {
      tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName],
      color: 'var(--codemirror-coral-color)',
    },
    {
      tag: [tags.definition(tags.name), tags.separator],
      color: 'var(--codemirror-ivory-color)',
    },
  ]),
)
export default [baseTheme, baseHighlightStyle]
