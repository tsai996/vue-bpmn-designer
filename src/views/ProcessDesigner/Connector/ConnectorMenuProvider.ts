import type { Translate } from 'bpmn-js/lib/features/palette/PaletteProvider'
import type { Element } from 'bpmn-js/lib/model/Types.ts'
import type {
  PopupMenuEntries,
  PopupMenuEntry,
} from 'diagram-js/lib/features/popup-menu/PopupMenuProvider'
import type { Connector } from '@/types/connector.ts'
import { filter } from 'min-dash'
import type EventBus from 'diagram-js/lib/core/EventBus'
import { getBusinessObject, isAny } from 'bpmn-js/lib/util/ModelUtil'
import { append as svgAppend, create as svgCreate } from 'tiny-svg'

export default class ConnectorMenuProvider {
  private readonly _translate: Translate
  private readonly _eventBus: EventBus
  static $inject: string[] = ['translate', 'eventBus']

  constructor(translate: Translate, eventBus: EventBus) {
    this._translate = translate
    this._eventBus = eventBus
  }

  _createImage(template: Connector) {
    const contents = template?.icon?.contents
    if (contents && /^#icon-/.test(contents)) {
      const svg = svgCreate('svg', {
        'aria-hidden': true,
        width: '1em',
        height: '1em',
      })
      const use = svgCreate('use', {
        href: contents,
      })
      svgAppend(svg, use)
      return {
        imageHtml: svg.outerHTML,
      }
    }
    return {
      imageUrl: contents,
    }
  }

  _createEntry(template: Connector, target: Element): PopupMenuEntry {
    return {
      label: template.name && this._translate(template.name),
      description: template.description && this._translate(template.description),
      documentationRef: template.documentationRef,
      ...this._createImage(template),
      group: template.category && {
        ...template.category,
        name: this._translate(template.category.name),
      },
      action: () => {
        this._eventBus.fire('connectorChooser.chosen', { template, element: target })
      },
    }
  }

  _isDifferentType(element: Element) {
    return (template: Connector) => {
      return isAny(element, template.appliesTo) && this._isConnectorApplied(element, template)
    }
  }

  _isConnectorApplied(element: Element, template: Connector) {
    const businessObject = getBusinessObject(element)
    if (businessObject) {
      const connectorId = businessObject.get('flowable:connectorId')
      return connectorId !== template.id
    }
    return false
  }

  createEntries(target: Element, replaceOptions: Connector[]) {
    const entries: PopupMenuEntries = {}
    const differentType = this._isDifferentType(target)
    filter(replaceOptions, differentType).forEach((replaceOption) => {
      entries[`apply-template-${replaceOption.id}`] = this._createEntry(replaceOption, target)
    })
    return entries
  }
}
