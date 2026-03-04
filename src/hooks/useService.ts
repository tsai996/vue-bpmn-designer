import type { Element, ModdleElement } from 'bpmn-js/lib/model/Types'
import type { Injector } from 'didi'
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'

export interface BpmnContext {
  selectedElement?: Element
  injector?: Injector
}

export const bpmnContext: BpmnContext = {
  selectedElement: undefined,
  injector: undefined,
}
export const useBpmnContextService = (context?: BpmnContext) => {
  if (context) {
    bpmnContext.selectedElement = context.selectedElement
    bpmnContext.injector = context.injector
  }
  const getService = <T>(serviceName: string) => {
    return bpmnContext.injector?.get<T>(serviceName)
  }
  const updateProperties = (props: Record<string, any>, moddleElement?: ModdleElement) => {
    if (bpmnContext.selectedElement) {
      const modeling = getService<Modeling>('modeling')
      const businessObject = getBusinessObject(bpmnContext.selectedElement)
      modeling?.updateModdleProperties(
        bpmnContext.selectedElement,
        moddleElement || businessObject,
        props,
      )
    }
  }

  return {
    getService,
    updateProperties,
    selectedElement: bpmnContext.selectedElement!,
    injector: bpmnContext.injector!,
  }
}
