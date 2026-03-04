import { is } from 'bpmn-js/lib/util/ModelUtil'
import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import type { ModdleElement } from 'bpmn-js/lib/model/Types'

const callActivityRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      if (is(node, 'bpmn:CallActivity')) {
        const calledElementType = node.get('calledElementType')
        const calledElement = node.get('calledElement')
        if (!calledElementType || !calledElement) {
          reporter.report(node.id, 'Missing call type or call target')
        }
      }
    },
  }
}
export default callActivityRequired
