import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'
import type { Shape } from 'bpmn-js/lib/model/Types.ts'
import { getDi, is } from 'bpmn-js/lib/util/ModelUtil'
import type EventBus from 'diagram-js/lib/core/EventBus'

export default class ExclusiveGatewayRender extends BaseRenderer {
  static $inject: string[] = ['eventBus']

  constructor(eventBus: EventBus) {
    super(eventBus, 1500)
  }
  canRender(element: Shape): boolean {
    return is(element, 'bpmn:ExclusiveGateway')
  }

  drawShape(parentNode: SVGElement, element: Shape): SVGElement {
    getDi(element).isMarkerVisible = true
    return super.drawShape(parentNode, element)
  }
}
