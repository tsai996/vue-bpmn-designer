import { getEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'
import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import type { ModdleElement } from 'bpmn-js/lib/model/Types'

const signalEventRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      const escalationEvent = getEventDefinition(node, 'bpmn:SignalEventDefinition')
      if (escalationEvent) {
        if (!escalationEvent.get('signalRef')) {
          reporter.report(node.id, 'Missing signal reference')
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
export default signalEventRequired
