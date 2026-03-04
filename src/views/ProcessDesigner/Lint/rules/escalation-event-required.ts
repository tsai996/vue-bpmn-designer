import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import type { ModdleElement } from 'bpmn-js/lib/model/Types'
import { getEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'

const escalationEventRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      const escalationEvent = getEventDefinition(node, 'bpmn:EscalationEventDefinition')
      if (escalationEvent) {
        if (!escalationEvent.get('escalationRef')) {
          reporter.report(node.id, 'Missing escalation reference')
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
export default escalationEventRequired
