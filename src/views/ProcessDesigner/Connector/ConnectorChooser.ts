import type EventBus from 'diagram-js/lib/core/EventBus'
import type { Connector } from '@/types/connector.ts'
import type { Element } from 'bpmn-js/lib/model/Types.ts'
import type BpmnReplace from 'bpmn-js/lib/features/replace/BpmnReplace'
import type CommandStack from 'diagram-js/lib/command/CommandStack'
import { getBusinessObject, isAny } from 'bpmn-js/lib/util/ModelUtil'
import type { ModdleElement } from 'bpmn-js/lib/model/Types'
import {
  getExtensionElement,
  getExtensionElementsList,
  getOrCreateExtensionElements,
} from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import { assign, without } from 'min-dash'
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling'

export default class ConnectorChooser {
  private readonly _eventBus: EventBus
  private readonly _bpmnReplace: BpmnReplace
  private readonly _commandStack: CommandStack
  private readonly _bpmnFactory: BpmnFactory
  private readonly _modeling: Modeling
  static $inject: string[]
  private readonly CAMUNDA_SERVICE_TASK_LIKE = [
    'flowable:class',
    'flowable:delegateExpression',
    'flowable:expression',
  ]

  constructor(
    eventBus: EventBus,
    bpmnReplace: BpmnReplace,
    commandStack: CommandStack,
    bpmnFactory: BpmnFactory,
    modeling: Modeling,
  ) {
    this._eventBus = eventBus
    this._bpmnReplace = bpmnReplace
    this._commandStack = commandStack
    this._bpmnFactory = bpmnFactory
    this._modeling = modeling
    eventBus.on('connectorChooser.chosen', (event: any) => {
      const { element, template } = event
      this.applyTemplate(element, template)
    })
  }

  /**
   * 将元素模板应用于给定的元素。
   * @param element
   * @param newTemplate
   */
  applyTemplate(element: Element, newTemplate: Connector) {
    element = this._updateTaskType(element, newTemplate)
    this._updateModelerTemplate(element, newTemplate)
    this._updateProperties(element, newTemplate)
    this._updateFieldProperties(element, newTemplate)
    this._updatePropertyProperties(element, newTemplate)
    this._updateExecutionListenerProperties(element, newTemplate)
  }

  _updateTaskType(element: Element, newTemplate: Connector) {
    const newType = newTemplate.elementType
    if (!newType) {
      return element
    }
    if (element.$type === newType.value) {
      return element
    }
    return this._bpmnReplace.replaceElement(element, { type: newType.value })
  }

  // 更新模板
  _updateModelerTemplate(element: Element, newTemplate: Connector) {
    const newId = newTemplate && newTemplate.id
    const newVersion = newTemplate && newTemplate.version
    const newIcon = newTemplate && newTemplate.icon?.contents
    this._modeling.updateProperties(element, {
      'flowable:connectorId': newId,
      'flowable:connectorVersion': newVersion,
      'flowable:connectorIcon': newIcon,
    })
  }

  // 更新属性
  _updateProperties(element: Element, newTemplate: Connector, businessObject?: ModdleElement) {
    const newProperties = newTemplate.properties?.filter(
      (newProperty) => newProperty.binding.type === 'property',
    )
    if (!newProperties?.length) {
      return
    }
    if (!businessObject) {
      businessObject = getBusinessObject(element)
    }
    const properties: Record<string, any> = {}
    newProperties.forEach((newProperty) => {
      const { binding, value } = newProperty
      const newBindingName = binding.name
      properties[newBindingName] = value
      if (this.CAMUNDA_SERVICE_TASK_LIKE.includes(newBindingName)) {
        this.CAMUNDA_SERVICE_TASK_LIKE.forEach((serviceTaskLikeProperty) => {
          if (serviceTaskLikeProperty !== newBindingName) {
            properties[serviceTaskLikeProperty] = undefined
          }
        })
      }
    })
    this._commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: businessObject,
      properties,
    })
  }

  // 更新 flowable:Field 属性
  _updateFieldProperties(element: Element, newTemplate: Connector, businessObject?: ModdleElement) {
    const newProperties = newTemplate.properties?.filter(
      (newProperty) => newProperty.binding.type === 'flowable:field',
    )
    if (!newProperties?.length) {
      return
    }
    if (!businessObject) {
      businessObject = getOrCreateExtensionElements(element)
    }
    const propertyName = isAny(businessObject, [
      'flowable:ExecutionListener',
      'flowable:TaskListener',
    ])
      ? 'fields'
      : 'values'
    const oldFields = getExtensionElementsList(element, 'flowable:Field')
    newProperties.forEach((newProperty) => {
      const newBinding = newProperty.binding
      // 添加新字段
      const newCamundaFieldInjection = this._createFieldInjection(
        newBinding,
        this._bpmnFactory,
        newProperty.value,
      )
      this._commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: businessObject,
        properties: {
          [propertyName]: [...businessObject.get(propertyName), newCamundaFieldInjection],
        },
      })
    })
    // 删除旧字段
    if (oldFields.length) {
      this._commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: businessObject,
        properties: {
          [propertyName]: without(businessObject.get(propertyName), (value: Element) =>
            oldFields.includes(value),
          ),
        },
      })
    }
  }

  // 更新 flowable:Property 属性
  _updatePropertyProperties(
    element: Element,
    newTemplate: Connector,
    businessObject?: ModdleElement,
  ) {
    const newProperties = newTemplate.properties?.filter(
      (newProperty) => newProperty.binding.type === 'flowable:property',
    )
    if (!newProperties?.length) {
      return
    }
    if (businessObject) {
      businessObject = getOrCreateExtensionElements(businessObject)
    } else {
      businessObject = getOrCreateExtensionElements(element)
    }
    let flowableProperties = getExtensionElement(element, 'flowable:Properties')
    if (!flowableProperties) {
      flowableProperties = this._bpmnFactory.create('flowable:Properties')
      this._commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: businessObject,
        properties: {
          values: [...businessObject.get('values'), flowableProperties],
        },
      })
    }
    const oldFlowableProperties = flowableProperties?.get('flowable:values')
      ? flowableProperties?.get('flowable:values').slice()
      : []
    newProperties.forEach((newProperty) => {
      const newPropertyValue = newProperty.value
      const newBinding = newProperty.binding
      const newFlowableProperty = this._createProperty(
        newBinding,
        this._bpmnFactory,
        newPropertyValue,
      )
      this._commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: flowableProperties,
        properties: {
          values: [...flowableProperties?.get('values'), newFlowableProperty],
        },
      })
    })
    if (oldFlowableProperties.length) {
      this._commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: flowableProperties,
        properties: {
          values: without(flowableProperties?.get('values'), (value: Element) =>
            oldFlowableProperties.includes(value),
          ),
        },
      })
    }
  }

  // 更新 flowable:ExecutionListener 属性
  _updateExecutionListenerProperties(element: Element, newTemplate: Connector) {
    const newProperties = newTemplate.properties?.filter(
      (newProperty) => newProperty.binding.type === 'flowable:executionListener',
    )
    if (!newProperties?.length) {
      return
    }
    const extensionElements = getOrCreateExtensionElements(element)
    const oldExecutionListeners = getExtensionElementsList(element, 'flowable:ExecutionListener')
    const newExecutionListeners = newProperties.map((newProperty) => {
      const newBinding = newProperty.binding
      const propertyValue = newProperty.value
      return this._createExecutionListener(newBinding, this._bpmnFactory, propertyValue)
    })
    this._commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: extensionElements,
      properties: {
        values: [
          ...without(extensionElements.get('values'), (value: Element) =>
            oldExecutionListeners.includes(value),
          ),
          ...newExecutionListeners,
        ],
      },
    })
  }

  _createProperty(
    binding: Record<string, any>,
    bpmnFactory: BpmnFactory,
    value?: string | boolean,
  ) {
    const { name } = binding
    return bpmnFactory.create('flowable:Property', {
      name,
      value,
    })
  }

  _createExecutionListener(
    binding: Record<string, any>,
    bpmnFactory: BpmnFactory,
    value?: string | boolean,
  ) {
    const { event, implementationType, scriptFormat } = binding
    if (implementationType === 'script' || scriptFormat) {
      return bpmnFactory.create('flowable:ExecutionListener', {
        event,
        script: bpmnFactory.create('flowable:Script', {
          scriptFormat,
          value,
        }),
      })
    }
  }

  _createFieldInjection(
    binding: Record<string, any>,
    bpmnFactory: BpmnFactory,
    value?: string | boolean,
  ) {
    const DEFAULT_PROPS: Record<string, any> = {
      string: undefined,
      expression: undefined,
      name: undefined,
    }
    const props = assign({}, DEFAULT_PROPS)
    const { expression, name } = binding
    if (!expression) {
      props.string = value
    } else {
      props.expression = value
    }
    props.name = name
    return bpmnFactory.create('flowable:Field', props)
  }
}
ConnectorChooser.$inject = ['eventBus', 'bpmnReplace', 'commandStack', 'bpmnFactory', 'modeling']
