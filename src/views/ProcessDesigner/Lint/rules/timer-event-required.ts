import { getEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'
import type { ModdleElement } from 'bpmn-js/lib/model/Types'
import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'

const timerEventRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      const timerEvent = getEventDefinition(node, 'bpmn:TimerEventDefinition')
      if (timerEvent) {
        if (
          !timerEvent.get('timeDuration')?.body &&
          !timerEvent.get('timeCycle')?.body &&
          !timerEvent.get('timeDate')?.body
        ) {
          reporter.report(node.id, 'Missing timer configuration')
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

export default timerEventRequired
