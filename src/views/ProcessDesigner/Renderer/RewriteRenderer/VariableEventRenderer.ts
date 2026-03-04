import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'
import BpmnRenderer, { type BpmnRendererConfig } from 'bpmn-js/lib/draw/BpmnRenderer'
import type EventBus from 'diagram-js/lib/core/EventBus'
import { isAny } from 'bpmn-js/lib/util/ModelUtil'
import { getFillColor, getStrokeColor } from 'bpmn-js/lib/draw/BpmnRenderUtil'
import type { Shape } from 'bpmn-js/lib/model/Types'
import { append as svgAppend, create as svgCreate } from 'tiny-svg'
import type PathMap from 'bpmn-js/lib/draw/PathMap'
import { isEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'
import { isLabel } from 'bpmn-js/lib/util/LabelUtil'

export default class VariableEventRenderer extends BaseRenderer {
  private readonly bpmnRenderer: BpmnRenderer
  private readonly config: BpmnRendererConfig
  private readonly pathMap: PathMap

  constructor(
    eventBus: EventBus,
    bpmnRenderer: BpmnRenderer,
    config: BpmnRendererConfig,
    pathMap: PathMap,
  ) {
    super(eventBus, 1500)
    this.bpmnRenderer = bpmnRenderer
    this.config = config
    this.pathMap = pathMap
  }

  canRender(element: Shape): boolean {
    if (!isLabel(element)) {
      if (
        isAny(element, ['bpmn:StartEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'])
      ) {
        return isEventDefinition(element, 'flowable:VariableListenerEventDefinition')
      }
    }
    return false
  }

  drawShape(parentNode: SVGElement, element: Shape): SVGElement {
    let renderer
    if (element.type === 'bpmn:IntermediateCatchEvent') {
      renderer = this.bpmnRenderer.handlers['bpmn:IntermediateCatchEvent']
    } else if (element.type === 'bpmn:BoundaryEvent') {
      renderer = this.bpmnRenderer.handlers['bpmn:BoundaryEvent']
    } else if (element.type === 'bpmn:StartEvent') {
      renderer = this.bpmnRenderer.handlers['bpmn:StartEvent']
    }
    if (!renderer) {
      return super.drawShape(parentNode, element)
    }
    const gfx = renderer(parentNode, element, { renderIcon: false })
    const defaultStrokeColor = this.config && this.config.defaultStrokeColor,
      defaultFillColor = this.config && this.config.defaultFillColor
    const pathData = this.pathMap.getScaledPath('EVENT_MULTIPLE', {
      xScaleFactor: 0.9,
      yScaleFactor: 0.9,
      containerWidth: element.width,
      containerHeight: element.height,
      position: {
        mx: 0.27,
        my: 0.4,
      },
    })
    const fill = getFillColor(element, defaultFillColor)
    const stroke = getStrokeColor(element, defaultStrokeColor)
    const path = svgCreate('path', {
      d: pathData,
      fill,
      stroke,
      strokeWidth: 1,
    })
    svgAppend(parentNode, path)
    return gfx
  }
}
;(VariableEventRenderer as any).$inject = [
  'eventBus',
  'bpmnRenderer',
  'config.bpmnRenderer',
  'pathMap',
]
