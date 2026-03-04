import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import type { ModdleElement } from 'bpmn-js/lib/model/Types.ts'
import { getEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'

const variableEventRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      const variableEvent = getEventDefinition(node, 'flowable:VariableListenerEventDefinition')
      if (variableEvent) {
        const variableChangeType = variableEvent.get('variableChangeType')
        const variableName = variableEvent.get('variableName')
        if (!variableChangeType || !variableName) {
          reporter.report(node.id, 'Missing variable change type or variable name')
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

export default variableEventRequired
