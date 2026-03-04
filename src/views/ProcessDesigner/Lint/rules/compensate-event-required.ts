import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import type { ModdleElement } from 'bpmn-js/lib/model/Types.ts'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { getEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'

const compensateEventRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      if (!is(node, 'bpmn:BoundaryEvent')) {
        const compensateEvent = getEventDefinition(node, 'bpmn:CompensateEventDefinition')
        if (compensateEvent) {
          if (!compensateEvent.get('activityRef')) {
            reporter.report(node.id, 'Lack of compensatory activities')
          }
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

export default compensateEventRequired
