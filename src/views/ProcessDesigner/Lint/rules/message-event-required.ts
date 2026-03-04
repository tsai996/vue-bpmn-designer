import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import type { ModdleElement } from 'bpmn-js/lib/model/Types.ts'
import { getEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'

const messageEventRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      const messageEvent = getEventDefinition(node, 'bpmn:MessageEventDefinition')
      if (messageEvent) {
        if (!messageEvent.get('messageRef')) {
          reporter.report(node.id, 'Missing message reference')
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

export default messageEventRequired
