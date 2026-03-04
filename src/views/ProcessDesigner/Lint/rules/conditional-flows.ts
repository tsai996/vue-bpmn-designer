import type { ModdleElement } from 'bpmn-js/lib/model/Types.ts'
import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'

const isConditionalForking = (node: ModdleElement) => {
  const defaultFlow = node['default']
  const outgoing = node.outgoing || []
  return defaultFlow || outgoing.find(hasCondition)
}

const hasCondition = (flow: ModdleElement) => {
  return !!flow.conditionExpression
}

const isDefaultFlow = (node: ModdleElement, flow: ModdleElement) => {
  return node['default'] === flow
}

const conditionalFlows = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      if (!isConditionalForking(node)) {
        return
      }
      const outgoing = node.outgoing || []
      outgoing.forEach((flow: ModdleElement) => {
        const missingCondition = !hasCondition(flow) && !isDefaultFlow(node, flow)
        if (missingCondition) {
          reporter.report(flow.id, 'Sequence flow is missing condition', ['conditionExpression'])
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

export default conditionalFlows
