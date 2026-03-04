import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import type { ModdleElement } from 'bpmn-js/lib/model/Types'
import { getEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'

const errorEventRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      const errorEvent = getEventDefinition(node, 'bpmn:ErrorEventDefinition')
      if (errorEvent) {
        if (!errorEvent.get('errorRef')) {
          reporter.report(node.id, 'Missing error reference')
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
export default errorEventRequired
