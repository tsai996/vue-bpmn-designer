import { useBpmnContextService } from '@/hooks/useService.ts'
import { getBusinessObject, getDi, is, isAny } from 'bpmn-js/lib/util/ModelUtil'
import type { Element, ModdleElement } from 'bpmn-js/lib/model/Types'
import { customRef } from 'vue'
import Ids from 'ids'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import type Canvas from 'diagram-js/lib/core/Canvas'
import {
  addExtensionElements,
  getExtensionElementsList,
} from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'
import { isDelegateExprValid } from '@/views/ProcessDesigner/utils/ValidationUtil.ts'
import type BpmnModeler from 'bpmn-js/lib/Modeler'
import type ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
import type GraphicsFactory from 'diagram-js/lib/core/GraphicsFactory'

export const isConditionalSource = (element: Element) => {
  return isAny(element, [
    'bpmn:Activity',
    'bpmn:ExclusiveGateway',
    'bpmn:InclusiveGateway',
    'bpmn:ComplexGateway',
  ])
}

export const nextId = (prefix = '') => {
  const ids = new Ids([32, 32, 1])
  return ids.nextPrefixed(prefix)
}

export const filterElementsByType = (objectList: any[], type: string) => {
  const list = objectList || []
  return list.filter((element) => is(element, type))
}

export const findRootElementsByType = (businessObject: ModdleElement, referencedType: string) => {
  const root = getRoot(businessObject)
  return filterElementsByType(root.get('rootElements'), referencedType)
}

export const getRoot = (businessObject: ModdleElement) => {
  let parent = businessObject
  while (parent?.$parent) {
    parent = parent.$parent
  }
  return parent
}

export const getRootElement = () => {
  const { getService } = useBpmnContextService()
  const canvas = getService<Canvas>('canvas')
  return canvas?.getRootElement()
}

export const removeRootElement = (element: Element) => {
  element = toRaw(element)
  const { getService, updateProperties } = useBpmnContextService()
  const modeler = getService<BpmnModeler>('bpmnjs')
  const root = modeler?.getDefinitions()
  if (root) {
    const elements: Element[] = root.get('rootElements') ?? []
    const newElements = elements.filter((e: Element) => e !== element)
    updateProperties(
      {
        rootElements: newElements,
      },
      root,
    )
  }
}

export const createOrUpdateRootElement = (
  properties: Record<string, any>,
  element: Element | string,
) => {
  const { getService, updateProperties } = useBpmnContextService()
  const modeler = getService<BpmnModeler>('bpmnjs')
  const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
  const root = modeler?.getDefinitions()
  if (root && bpmnFactory) {
    const elements: Element[] = root.get('rootElements') ?? []
    if (typeof element === 'string') {
      const newElement = createElement(element, bpmnFactory, properties, root)
      updateProperties(
        {
          rootElements: [...elements, newElement],
        },
        root,
      )
    } else {
      element = toRaw(element)
      updateProperties(properties, element)
    }
  }
}

export const createElement = (
  type: string,
  bpmnFactory: BpmnFactory,
  properties?: Record<string, any>,
  parent?: Element,
) => {
  const element: Element = bpmnFactory.create(type, properties)
  if (parent) {
    element.$parent = parent
  }
  return element
}

export const findRootElementById = (businessObject: ModdleElement, type: string, id: string) => {
  const elements = findRootElementsByType(businessObject, type)
  return elements.find((element) => element.id === id)
}

export const useCustomRef = <T = string>(key: string) => {
  const { selectedElement, updateProperties } = useBpmnContextService()
  return customRef<T>((track, trigger) => {
    return {
      get() {
        track()
        return selectedElement?.businessObject?.get(key)
      },
      set(newValue: T) {
        updateProperties({
          [key]: newValue,
        })
        trigger()
      },
    }
  })
}

export const useFieldRef = <T = string>(key: string) => {
  const { selectedElement, updateProperties } = useBpmnContextService()
  return customRef<T>((track, trigger) => {
    return {
      get() {
        track()
        const fields = getExtensionElementsList(selectedElement, 'flowable:Field')
        const field = fields.find((field) => field.get('name') === key)
        return field?.get('stringValue') || field?.get('expression') || field?.get('string')
      },
      set(newValue: T) {
        const fields = getExtensionElementsList(selectedElement, 'flowable:Field')
        const field = fields.find((field) => field.get('name') === key)
        const properties: Record<string, any> = {
          name: key,
          string: undefined,
          expression: undefined,
          stringValue: undefined,
        }
        if (Array.isArray(newValue)) {
          properties['stringValue'] = newValue
        } else if (typeof newValue === 'string' && isDelegateExprValid(newValue, true)) {
          properties['expression'] = newValue
        } else {
          properties['string'] = newValue
        }
        if (!field) {
          const businessObject = getBusinessObject(selectedElement)
          const fieldElement = businessObject.$model.create('flowable:Field', properties)
          addExtensionElements(selectedElement, fieldElement)
        } else {
          updateProperties(properties, field)
        }
        trigger()
      },
    }
  })
}

export const getLoopCharacteristics = (element: Element) => {
  const bo = getBusinessObject(element)
  return bo.loopCharacteristics
}

export const isMultiInstanceSupported = (element: Element) => {
  const loopCharacteristics = getLoopCharacteristics(element)
  return !!loopCharacteristics && is(loopCharacteristics, 'bpmn:MultiInstanceLoopCharacteristics')
}

export const isPropertySupported = (element: Element, property: string) => {
  const businessObject = getBusinessObject(element)
  const propertiesByName = businessObject?.$descriptor?.propertiesByName || {}
  return !!propertiesByName[property]
}

export const setElementColor = (element: Element[], colors: Record<string, string>) => {
  const { getService } = useBpmnContextService()
  const elementRegistry = getService<ElementRegistry>('elementRegistry')
  const graphicsFactory = getService<GraphicsFactory>('graphicsFactory')
  element.forEach((element) => {
    const di = getDi(element)
    if (di) {
      if (isAny(di, ['bpmndi:BPMNEdge', 'bpmndi:BPMNShape'])) {
        for (const key in colors) {
          di.set(key, colors[key])
        }
      }
      const gfx = elementRegistry?.getGraphics(element)
      const type = element.waypoints ? 'connection' : 'shape'
      gfx && graphicsFactory?.update(type, element, gfx)
    }
  })
}
