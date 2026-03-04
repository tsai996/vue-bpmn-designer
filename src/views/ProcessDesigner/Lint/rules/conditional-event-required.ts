import type { ModdleElement } from 'bpmn-js/lib/model/Types'
import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import { getEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'

const conditionalEventRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      const conditionalEvent = getEventDefinition(node, 'bpmn:ConditionalEventDefinition')
      if (conditionalEvent) {
        if (!conditionalEvent.get('condition')?.body) {
          reporter.report(node.id, 'Missing conditional expression')
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

export default conditionalEventRequired
