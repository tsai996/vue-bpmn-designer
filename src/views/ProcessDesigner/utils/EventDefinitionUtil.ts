import type { Element } from 'bpmn-js/lib/model/Types.ts'
import { getBusinessObject, is, isAny } from 'bpmn-js/lib/util/ModelUtil'
import { find } from 'min-dash'
import { useBpmnContextService } from '@/hooks/useService.ts'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import type Canvas from 'diagram-js/lib/core/Canvas'
import { createElement, findRootElementsByType } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { getExtensionElementsList } from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'

export const supportsExecutionListener = () => {
  const { selectedElement } = useBpmnContextService()
  return isAny(selectedElement, ['bpmn:FlowNode', 'bpmn:SequenceFlow', 'bpmn:Process'])
}

export const getMessageEvents = (element: Element): Element[] => {
  const businessObject = getBusinessObject(element)
  return findRootElementsByType(businessObject, 'bpmn:Message')
}

export const getErrorEvents = (element: Element): Element[] => {
  const businessObject = getBusinessObject(element)
  return findRootElementsByType(businessObject, 'bpmn:Error')
}

export const getEscalationEvents = (element: Element): Element[] => {
  const businessObject = getBusinessObject(element)
  return findRootElementsByType(businessObject, 'bpmn:Escalation')
}

export const getSignalEvents = (element: Element): Element[] => {
  const businessObject = getBusinessObject(element)
  return findRootElementsByType(businessObject, 'bpmn:Signal')
}

export const isEventDefinition = (element: Element, eventType: string | string[]) => {
  if (!Array.isArray(eventType)) {
    eventType = [eventType]
  }
  const businessObject = getBusinessObject(element)
  const eventDefinitions: Element[] = businessObject.get('eventDefinitions') || []
  const isEvent = eventDefinitions.some((definition: Element) => isAny(definition, eventType))
  if (!isEvent) {
    const elements = getExtensionElementsList(element)
    return elements.some((definition: Element) => isAny(definition, eventType))
  }
  return isEvent
}

export const getEventDefinition = (element: Element, eventType: string) => {
  const businessObject = getBusinessObject(element)
  const eventDefinitions: Element[] = businessObject.get('eventDefinitions') || []
  const eventDefinition = find(eventDefinitions, (definition: Element) => is(definition, eventType))
  if (!eventDefinition) {
    const elements = getExtensionElementsList(element)
    return find(elements, (definition: Element) => is(definition, eventType))
  }
  return eventDefinition
}

export const getVariableEventDefinition = (element: Element): any => {
  return getEventDefinition(element, 'flowable:VariableListenerEventDefinition')
}

export const getSignalEventDefinition = (element: Element): any => {
  return getEventDefinition(element, 'bpmn:SignalEventDefinition')
}

export const getEscalationEventDefinition = (element: Element): any => {
  return getEventDefinition(element, 'bpmn:EscalationEventDefinition')
}

export const getConditionalEventDefinition = (element: Element): any => {
  return getEventDefinition(element, 'bpmn:ConditionalEventDefinition')
}

export const getTimerEventDefinition = (element: Element): any => {
  return getEventDefinition(element, 'bpmn:TimerEventDefinition')
}

export const getErrorEventDefinition = (element: Element): any => {
  return getEventDefinition(element, 'bpmn:ErrorEventDefinition')
}

export const getCompensateEventDefinition = (element: Element) => {
  return getEventDefinition(element, 'bpmn:CompensateEventDefinition')
}

export const getMessageEventDefinition = (element: Element) => {
  if (is(element, 'bpmn:ReceiveTask')) {
    return getBusinessObject(element)
  }
  return getEventDefinition(element, 'bpmn:MessageEventDefinition')
}

export const createOrUpdateEventDefinition = (properties: Record<string, any>, type: string) => {
  const { getService, updateProperties } = useBpmnContextService()
  const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
  const modeler = getService<BpmnModeler>('bpmnjs')
  if (bpmnFactory) {
    const root = modeler?.getDefinitions()
    const businessObject = getBusinessObject(root)
    const { id } = properties
    const message = createElement(type, bpmnFactory, properties, root)
    const elements = findRootElementsByType(businessObject, type)
    const index = elements.findIndex((element) => element.id === id)
    if (index > -1) {
      const message = elements[index]
      updateProperties(properties, message)
    } else {
      updateProperties(
        {
          rootElements: [...root.get('rootElements'), message],
        },
        root,
      )
    }
    return message
  }
}

export const removeEventDefinition = (id: string, type: string) => {
  const { selectedElement, getService, updateProperties } = useBpmnContextService()
  const modeler = getService<BpmnModeler>('bpmnjs')
  const root = modeler?.getDefinitions()
  if (selectedElement && root) {
    const elements = root.get('rootElements')
    const newElements = elements.filter((e: Element) => !(e.id === id && e.$type === type))
    updateProperties(
      {
        rootElements: newElements,
      },
      root,
    )
  }
}
