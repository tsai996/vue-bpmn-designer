import type { Element } from 'bpmn-js/lib/model/Types.ts'
import { useBpmnContextService } from '@/hooks/useService.ts'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil'
import { createElement } from '@/views/ProcessDesigner/utils/ElementUtil.ts'

export const getOrCreateExtensionElements = (element: Element) => {
  const businessObject = getBusinessObject(element)
  let extensionElements = businessObject.get('extensionElements')
  const { getService, updateProperties } = useBpmnContextService()
  const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
  if (!extensionElements && bpmnFactory) {
    extensionElements = createElement(
      'bpmn:ExtensionElements',
      bpmnFactory,
      {
        values: [],
      },
      element,
    )
    updateProperties({ extensionElements }, businessObject)
  }
  return extensionElements
}

export const getExtensionElementsList = (element: Element, type?: string) => {
  const businessObject = getBusinessObject(element)
  const extensionElements = businessObject.get('extensionElements')
  if (!extensionElements || Array.isArray(extensionElements)) {
    return []
  }
  const values: Element[] = extensionElements.get('values')
  if (!values || !values.length) {
    return []
  }
  if (type) {
    return values.filter((value) => is(value, type))
  }
  return values
}

export const getExtensionElement = (element: Element, type: string) => {
  const businessObject = getBusinessObject(element)
  const extensionElements = businessObject.get('extensionElements')
  const values: Element[] = extensionElements?.get('values')
  return values?.find((value) => is(value, type))
}

export const addExtensionElements = (
  element: Element,
  extensionElementToAdd: Element | Element[],
) => {
  if (!Array.isArray(extensionElementToAdd)) {
    extensionElementToAdd = [extensionElementToAdd]
  }
  const { getService, updateProperties } = useBpmnContextService()
  const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
  const businessObject = getBusinessObject(element)
  let extensionElements = businessObject.get('extensionElements')
  if (!extensionElements && bpmnFactory) {
    extensionElements = createElement(
      'bpmn:ExtensionElements',
      bpmnFactory,
      {
        values: [],
      },
      element,
    )
    updateProperties({ extensionElements }, businessObject)
  }
  for (const addElement of extensionElementToAdd) {
    addElement.$parent = extensionElements
  }
  updateProperties(
    {
      values: [...extensionElements.get('values'), ...extensionElementToAdd],
    },
    extensionElements,
  )
}

export const removeExtensionElements = (
  element: Element,
  extensionElementsToRemove: Element | Element[],
) => {
  if (!Array.isArray(extensionElementsToRemove)) {
    extensionElementsToRemove = [extensionElementsToRemove]
  }
  const { updateProperties } = useBpmnContextService()
  const businessObject = getBusinessObject(element)
  const extensionElements = businessObject.get('extensionElements')
  let values: Element[] = extensionElements.get('values')
  values = values.filter((value) => !extensionElementsToRemove.includes(value))
  updateProperties(
    {
      values,
    },
    extensionElements,
  )
}
