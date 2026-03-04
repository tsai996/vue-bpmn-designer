import type { ModdleElement } from 'bpmn-js/lib/model/Types.ts'
import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import { is } from 'bpmn-js/lib/util/ModelUtil'

const activityLabelRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      if (is(node, 'bpmn:Activity')) {
        const name = (node.name || '').trim()
        if (name.length === 0) {
          reporter.report(node.id, 'Element is missing label/name', ['name'])
        }
      }
    },
    meta: {
      documentation: {
        url: 'https://demo.lowflow.vip/',
      },
    },
  }
}

export default activityLabelRequired
