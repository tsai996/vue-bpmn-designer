import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'
import BpmnRenderer, { type BpmnRendererConfig } from 'bpmn-js/lib/draw/BpmnRenderer'
import type EventBus from 'diagram-js/lib/core/EventBus'
import type { Shape } from 'bpmn-js/lib/model/Types.ts'
import { getBusinessObject, is, isAny } from 'bpmn-js/lib/util/ModelUtil'
import { isLabel } from 'bpmn-js/lib/util/LabelUtil'
import { append as svgAppend, attr as svgAttr, create as svgCreate } from 'tiny-svg'
import { getFillColor, getStrokeColor } from 'bpmn-js/lib/draw/BpmnRenderUtil'

interface EnhanceBpmnRendererConfig {
  bpmnRenderer: BpmnRendererConfig
  connectorIconRenderer: {
    iconProperty?: string
  }
}

export default class ConnectorIconRenderer extends BaseRenderer {
  private readonly _bpmnRenderer: BpmnRenderer
  private readonly _config: EnhanceBpmnRendererConfig
  private readonly _iconProperty: string
  static $inject: string[] = ['eventBus', 'bpmnRenderer', 'config']

  constructor(eventBus: EventBus, bpmnRenderer: BpmnRenderer, config: EnhanceBpmnRendererConfig) {
    super(eventBus, 1500)
    this._bpmnRenderer = bpmnRenderer
    this._config = config
    this._iconProperty = config.connectorIconRenderer.iconProperty || 'flowable:connectorIcon'
  }

  canRender(element: Shape): boolean {
    if (!isLabel(element)) {
      if (isAny(element, ['bpmn:Task', 'bpmn:Event'])) {
        return !!this._getIcon(element)
      }
    }
    return false
  }

  _getIcon(element: Shape) {
    return getBusinessObject(element).get(this._iconProperty)
  }

  _createSvg(shape: Shape) {
    const icon = this._getIcon(shape)
    const defaultStrokeColor = this._config && this._config.bpmnRenderer.defaultStrokeColor,
      defaultFillColor = this._config && this._config.bpmnRenderer.defaultFillColor
    const size = 22
    const padding = is(shape, 'bpmn:Task')
      ? {
          x: 3,
          y: 3,
        }
      : {
          x: (shape.width - size) / 2,
          y: (shape.height - size) / 2,
        }
    const svg = svgCreate('svg', {
      'aria-hidden': true,
      width: size,
      height: size,
      color: getStrokeColor(shape, defaultStrokeColor),
      ...padding,
    })
    const use = svgCreate('use', {
      href: icon,
      fill: getFillColor(shape, defaultFillColor),
      stroke: getStrokeColor(shape, defaultStrokeColor),
    })
    svgAppend(svg, use)
    return svg
  }

  drawShape(visuals: SVGElement, shape: Shape): SVGElement {
    type HandlerKeys = keyof typeof this._bpmnRenderer.handlers
    const bpmnTypes: readonly HandlerKeys[] = [
      'bpmn:BoundaryEvent',
      'bpmn:EndEvent',
      'bpmn:IntermediateCatchEvent',
      'bpmn:IntermediateThrowEvent',
      'bpmn:StartEvent',
      'bpmn:Task',
    ]
    const abc = bpmnTypes.find((t) => is(shape, t))
    if (abc) {
      const renderer = this._bpmnRenderer.handlers[abc]
      const gfx = renderer(visuals, shape, { renderIcon: false })
      const icon = this._getIcon(shape)
      if (/^#icon-/.test(icon)) {
        const svg = this._createSvg(shape)
        svgAppend(visuals, svg)
        return gfx
      }
      const size = 18
      const padding = is(shape, 'bpmn:Task')
        ? {
            x: 5,
            y: 5,
          }
        : {
            x: (shape.width - size) / 2,
            y: (shape.height - size) / 2,
          }
      const img = svgCreate('image')
      svgAttr(img, {
        href: icon,
        width: size,
        height: size,
        ...padding,
      })
      svgAppend(visuals, img)
      return gfx
    }
    return super.drawShape(visuals, shape)
  }
}
