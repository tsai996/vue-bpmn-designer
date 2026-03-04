declare module 'bpmn-js-bpmnlint' {
  import type { ModuleDefinition } from 'didi'

  export class Linting {
    isActive(): boolean
    toggle(newActive: boolean): boolean
    update(): void
  }

  export interface ElementIssue {
    id: string
    message: string
    category: 'error' | 'warning'
    rule: string
    line: number
    meta: any
  }

  export interface Issues {
    [key: string]: Array<ElementIssue>
  }

  const bpmnlint: ModuleDefinition
  export default bpmnlint
}
