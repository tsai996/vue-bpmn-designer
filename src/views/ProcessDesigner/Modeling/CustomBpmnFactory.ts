import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import type { Moddle, ModdleElement } from 'bpmn-js/lib/model/Types'

export default class CustomBpmnFactory extends BpmnFactory {
  constructor(moddle: Moddle) {
    super(moddle)
  }

  create(type: string, attrs?: any): ModdleElement {
    if (type === 'bpmn:AdHocSubProcess') {
      attrs = {
        ...attrs,
        cancelRemainingInstances: 'true',
        ordering: 'Parallel',
      }
    } else if (type === 'bpmn:CallActivity') {
      attrs = {
        ...attrs,
        calledElementType: 'key',
      }
    } else if (type === 'bpmn:StartEvent') {
      attrs = {
        ...attrs,
        initiator: 'initiator',
      }
    }
    if (type === 'bpmn:ScriptTask') {
      attrs = {
        ...attrs,
        scriptFormat: 'javascript',
      }
    }
    return super.create(type, attrs)
  }
}
