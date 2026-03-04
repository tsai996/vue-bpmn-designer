import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import type { ModdleElement } from 'bpmn-js/lib/model/Types.ts'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { isEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'

const eventSubProcessTypedStartEvent = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      if (!is(node, 'bpmn:SubProcess') || !node.triggeredByEvent) {
        return
      }
      const flowElements = node.flowElements || []
      flowElements.forEach((flowElement: ModdleElement) => {
        if (!is(flowElement, 'bpmn:StartEvent')) {
          return false
        }
        const eventDefinitions = flowElement.eventDefinitions || []
        if (eventDefinitions.length === 0) {
          if (!isEventDefinition(flowElement, 'flowable:VariableListenerEventDefinition')) {
            reporter.report(flowElement.id, 'Start event is missing event definition', [
              'eventDefinitions',
            ])
          }
        }
      })
    },
    meta: {
      documentation: {
        url: 'https://demo.lowflow.vip/',
      },
    },
  }
}
export default eventSubProcessTypedStartEvent
