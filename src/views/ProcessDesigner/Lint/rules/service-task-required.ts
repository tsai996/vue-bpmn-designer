import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import type { ModdleElement } from 'bpmn-js/lib/model/Types.ts'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import {
  isClassExpressionValid,
  isClassValid,
  isDelegateExprValid,
} from '@/views/ProcessDesigner/utils/ValidationUtil.ts'

const serviceTaskRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      if (is(node, 'bpmn:ServiceTask')) {
        const type = node.get('type')
        if (!type) {
          const javaClass = node.get('class')
          const expression = node.get('expression')
          const delegateExpression = node.get('delegateExpression')
          if (!javaClass && !expression && !delegateExpression) {
            reporter.report(node.id, 'Missing class or expression/delegateExpression')
          }
          if (javaClass && !isClassValid(javaClass)) {
            reporter.report(node.id, 'Invalid class')
          }
          if (expression && !isClassExpressionValid(expression)) {
            reporter.report(node.id, 'Invalid expression')
          }
          if (delegateExpression && !isDelegateExprValid(delegateExpression)) {
            reporter.report(node.id, 'Invalid delegateExpression')
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

export default serviceTaskRequired
