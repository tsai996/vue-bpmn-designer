import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import type { ModdleElement } from 'bpmn-js/lib/model/Types.ts'
import { is } from 'bpmn-js/lib/util/ModelUtil'

const userTaskRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      if (is(node, 'bpmn:UserTask')) {
        const assignee = node.get('assignee')
        if (assignee) {
          return
        }
        const candidateUsers = node.get('candidateUsers')
        if (candidateUsers && candidateUsers.length) {
          return
        }
        const candidateGroups = node.get('candidateGroups')
        if (candidateGroups && candidateGroups.length) {
          return
        }
        reporter.report(node.id, 'Missing assignee or candidate/group')
      }
    },
    meta: {
      documentation: {
        url: 'https://demo.lowflow.vip/',
      },
    },
  }
}

export default userTaskRequired
