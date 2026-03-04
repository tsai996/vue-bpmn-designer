import type { ModuleDeclaration } from 'didi'
import CustomBpmnReplace from './CustomBpmnReplace.ts'

const customReplace: ModuleDeclaration = {
  __init__: ['replace'],
  replace: ['type', CustomBpmnReplace],
}

export default customReplace
