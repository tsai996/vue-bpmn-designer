import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import type { ModdleElement } from 'bpmn-js/lib/model/Types.ts'
import { is } from 'bpmn-js/lib/util/ModelUtil'

const scriptTaskRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      if (is(node, 'bpmn:ScriptTask')) {
        const scriptFormat = node.get('scriptFormat')
        const script = node.get('script')
        if (!scriptFormat || !script) {
          reporter.report(node.id, 'Missing scriptFormat or script')
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

export default scriptTaskRequired
