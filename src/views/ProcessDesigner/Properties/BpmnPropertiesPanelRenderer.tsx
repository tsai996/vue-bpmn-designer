import type { Injector } from 'didi'
import type EventBus from 'diagram-js/lib/core/EventBus'
import type { Element } from 'bpmn-js/lib/model/Types'
import type Canvas from 'diagram-js/lib/core/Canvas'
import type { RootLike } from 'diagram-js/lib/model/Types'
import { type VNode } from 'vue'

export interface BpmnPropertiesPanelRendererConfig {
  parent?: string | HTMLElement
  show?: boolean
}

export class BpmnPropertiesPanelRenderer {
  private readonly eventBus: EventBus
  private readonly injector: Injector
  private readonly container: VNode
  private readonly config: BpmnPropertiesPanelRendererConfig

  constructor(
    injector: Injector,
    eventBus: EventBus,
    config: BpmnPropertiesPanelRendererConfig = {},
  ) {
    this.eventBus = eventBus
    this.injector = injector
    this.config = config
    this.container = (
      <div style="height: 100%" tabindex="-1" class="bio-properties-panel-container"></div>
    )
    eventBus.on<{ element: Element }>('root.added', ({ element }) => {
      this._render(element)
    })
    eventBus.on('diagram.init', (event) => {
      // console.log('diagram.init', event)
    })
    eventBus.on('diagram.destroy', () => {
      this.eventBus.fire('propertiesPanel.detach')
    })
  }

  _render(element: RootLike) {
    const canvas = this.injector.get<Canvas>('canvas')
    if (!element) {
      element = canvas.getRootElement()
    }
    if (element && element.isImplicit) {
      return
    }
    const { parent } = this.config
    if (parent) {
      let ele: HTMLElement | null = null

      if (typeof parent === 'string') {
        ele = document.querySelector(parent)
        if (!ele) {
          console.error(`target is not found: ${parent}`)
          return
        }
      } else if (parent instanceof HTMLElement) {
        ele = parent
      } else {
        console.error(`target is not HTMLElement: ${parent}`)
        return
      }
      if (ele) {
      }
    }
    this.eventBus.fire('propertiesPanel.rendered')
  }
}

;(BpmnPropertiesPanelRenderer as any).$inject = ['injector', 'eventBus', 'config.propertiesPanel']
