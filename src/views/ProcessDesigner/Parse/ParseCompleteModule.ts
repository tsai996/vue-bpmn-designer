import type EventBus from 'diagram-js/lib/core/EventBus'
import type { BpmnRendererConfig } from 'bpmn-js/lib/draw/BpmnRenderer'
import type { Element } from 'bpmn-js/lib/model/Types.ts'
import { is } from 'bpmn-js/lib/util/ModelUtil'

export default class ParseCompleteModule {
  static $inject: string[] = ['eventBus', 'config']

  constructor(eventBus: EventBus, config: BpmnRendererConfig) {
    eventBus.on<{
      definitions: Element
      elementsById: Record<string, Element>
    }>('import.parse.complete', ({ definitions, elementsById }) => {
      const rootElements: Element[] = definitions.rootElements
      for (const rootElement of rootElements) {
        if (is(rootElement, 'bpmn:Process')) {
          const { flowElements } = rootElement
          flowElements.forEach((flowElement: Element) => {
            if (is(flowElement, 'bpmn:FlowNode')) {
              console.log(flowElement)
            }
          })
        }
      }
    })
  }
}
