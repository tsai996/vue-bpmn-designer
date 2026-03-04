import ContextPadProvider, {
  type ContextPadConfig,
} from 'bpmn-js/lib/features/context-pad/ContextPadProvider'
import type ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
import Create from 'diagram-js/lib/features/create/Create'
import type AutoPlace from 'diagram-js/lib/features/auto-place/AutoPlace'
import type { Injector } from 'didi'
import type { ContextPadEntries } from 'diagram-js/lib/features/context-pad/ContextPadProvider'
import type EventBus from 'diagram-js/lib/core/EventBus'
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling'
import type Connect from 'diagram-js/lib/features/connect/Connect'
import PopupMenu from 'diagram-js/lib/features/popup-menu/PopupMenu'
import type Rules from 'diagram-js/lib/features/rules/Rules'
import type { Translate } from 'bpmn-js/lib/features/palette/PaletteProvider'
import AppendPreview from 'bpmn-js/lib/features/append-preview/AppendPreview'
import type Canvas from 'diagram-js/lib/core/Canvas'
import type { Element, Shape } from 'bpmn-js/lib/model/Types'
import { assign } from 'min-dash'
import type { ContextPadEntryAction } from 'diagram-js/lib/features/context-pad/ContextPadProvider.ts'
import type ContextPad from 'diagram-js/lib/features/context-pad/ContextPad'
import type { ContextPadTarget } from 'diagram-js/lib/features/context-pad/ContextPad'

export default class CustomContextPadProvider extends ContextPadProvider {
  private readonly elementFactory: ElementFactory
  private readonly create: Create
  private readonly translate: Translate
  private readonly appendPreview: AppendPreview
  private readonly autoPlace: AutoPlace | null = null

  constructor(
    config: ContextPadConfig,
    injector: Injector,
    eventBus: EventBus,
    contextPad: ContextPad,
    modeling: Modeling,
    elementFactory: ElementFactory,
    connect: Connect,
    create: Create,
    popupMenu: PopupMenu,
    canvas: Canvas,
    rules: Rules,
    translate: Translate,
    appendPreview: AppendPreview,
  ) {
    super(
      config,
      injector,
      eventBus,
      contextPad,
      modeling,
      elementFactory,
      connect,
      create,
      popupMenu,
      canvas,
      rules,
      translate,
      appendPreview,
    )
    this.elementFactory = elementFactory
    this.create = create
    this.translate = translate
    this.appendPreview = appendPreview
    if (config?.autoPlace !== false) {
      this.autoPlace = injector.get<AutoPlace>('autoPlace', false)
    }
  }

  getContextPadEntries(element: Element): ContextPadEntries {
    const actions: ContextPadEntries = super.getContextPadEntries(element)
    const previewAppend = (type: string) => {
      return (_: Event, target: ContextPadTarget) => {
        if (this.autoPlace) {
          this.appendPreview.create(target as Shape, type, {})
          return () => {
            this.appendPreview.cleanUp()
          }
        }
      }
    }
    if (actions['append.compensation-activity'] || actions['append.append-task']) {
      const appendServiceTask: ContextPadEntryAction = (event: Event, target: ContextPadTarget) => {
        const shape = this.elementFactory.createShape({ type: 'bpmn:ServiceTask' })
        if (this.autoPlace) {
          this.autoPlace?.append(target as Shape, shape)
        } else {
          this.create.start(event, shape, {
            source: element,
          })
        }
      }
      const previewServiceTask = previewAppend('bpmn:ServiceTask')
      assign(actions, {
        'append.compensation-activity': {
          group: 'model',
          className: 'bpmn-icon-service-task',
          title: this.translate('Append Service Task'),
          action: {
            dragstart: appendServiceTask,
            click: appendServiceTask,
            hover: previewServiceTask,
          },
        },
      })
    }
    if (actions['append.append-task']) {
      const appendUserTask: ContextPadEntryAction = (event: Event, target: ContextPadTarget) => {
        const shape = this.elementFactory.createShape({ type: 'bpmn:UserTask' })
        if (this.autoPlace) {
          this.autoPlace?.append(target as Shape, shape)
        } else {
          this.create.start(event, shape, {
            source: element,
          })
        }
      }
      const previewUserTask = previewAppend('bpmn:UserTask')
      assign(actions, {
        'append.append-task': {
          group: 'model',
          className: 'bpmn-icon-user-task',
          title: this.translate('Append User Task'),
          action: {
            dragstart: appendUserTask,
            click: appendUserTask,
            hover: previewUserTask,
          },
        },
      })
    }
    return actions
  }
}
