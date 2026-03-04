import Replace, { type EventBus } from 'diagram-js/lib/features/replace/Replace'
import type { ShapeLike } from 'diagram-js/lib/model/Types.ts'
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil'
import {
  getExtensionElement,
  getExtensionElementsList,
  removeExtensionElements,
} from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'

export default class CustomBpmnReplace extends Replace {
  private readonly _bpmnFactory: BpmnFactory
  private readonly _modeling: Modeling

  constructor(modeling: Modeling, eventBus: EventBus, bpmnFactory: BpmnFactory) {
    super(modeling, eventBus)
    this._bpmnFactory = bpmnFactory
    this._modeling = modeling
  }

  replaceElement(oldElement: ShapeLike, attrs: any, hints: any): ShapeLike {
    if (is(oldElement, 'bpmn:ServiceTask')) {
      if (is(attrs, 'bpmn:ServiceTask')) {
        const businessObject = getBusinessObject(attrs)
        this._modeling.updateModdleProperties(attrs, businessObject, {
          type: undefined,
          topic: undefined,
          class: undefined,
          expression: undefined,
          delegateExpression: undefined,
          resultVariableName: undefined,
        })
      }
      const fields = getExtensionElementsList(attrs, 'flowable:Field')
      if (fields.length > 0) {
        removeExtensionElements(attrs, fields)
      }
    }
    if (attrs.eventDefinitionType === 'flowable:VariableListenerEventDefinition') {
      const businessObject = getBusinessObject(attrs)
      let extensionElements = businessObject.get('extensionElements')
      if (!extensionElements) {
        extensionElements = this._bpmnFactory.create('bpmn:ExtensionElements')
      }
      const variableEventDefinition = this._bpmnFactory.create(
        attrs.eventDefinitionType,
        attrs.eventDefinitionAttrs,
      )
      attrs.eventDefinitionType = undefined
      attrs.eventDefinitionAttrs = undefined
      extensionElements.get('values').push(variableEventDefinition)
      this._modeling.updateModdleProperties(attrs, businessObject, {
        extensionElements,
      })
    } else {
      const variableEventDefinition = getExtensionElement(
        attrs,
        'flowable:VariableListenerEventDefinition',
      )
      if (variableEventDefinition) {
        removeExtensionElements(attrs, variableEventDefinition)
      }
    }
    return super.replaceElement(oldElement, attrs, hints)
  }
}
CustomBpmnReplace.$inject.push('bpmnFactory')
