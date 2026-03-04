import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import type { ModdleElement } from 'bpmn-js/lib/model/Types.ts'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { isExpressionValid } from '@/views/ProcessDesigner/utils/ValidationUtil.ts'

const sequenceFlowsRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      if (is(node, 'bpmn:SequenceFlow')) {
        const conditionExpression = node.get('conditionExpression')
        if (conditionExpression) {
          const expression = conditionExpression.body
          if (expression) {
            if (!isExpressionValid(expression)) {
              reporter.report(node.id, 'Ineffective condition table expression')
            }
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

export default sequenceFlowsRequired
