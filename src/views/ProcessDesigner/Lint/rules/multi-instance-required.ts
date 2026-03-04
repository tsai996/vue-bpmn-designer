import { is } from 'bpmn-js/lib/util/ModelUtil'
import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import type { ModdleElement } from 'bpmn-js/lib/model/Types'

const multiInstanceRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      if (is(node, 'bpmn:Activity')) {
        const loopCharacteristics = node.get('loopCharacteristics')
        if (loopCharacteristics) {
          const { collection, loopCardinality } = loopCharacteristics
          if (!collection && !loopCardinality?.body) {
            reporter.report(node.id, 'Missing collection variable or loop cardinality')
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
export default multiInstanceRequired
