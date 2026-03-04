import PaletteProvider, { type Translate } from 'bpmn-js/lib/features/palette/PaletteProvider'
import Palette from 'diagram-js/lib/features/palette/Palette'
import Create from 'diagram-js/lib/features/create/Create'
import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
import SpaceTool from 'diagram-js/lib/features/space-tool/SpaceTool'
import LassoTool from 'diagram-js/lib/features/lasso-tool/LassoTool'
import HandTool from 'diagram-js/lib/features/hand-tool/HandTool'
import GlobalConnect from 'diagram-js/lib/features/global-connect/GlobalConnect'
import type { PaletteEntries } from 'diagram-js/lib/features/palette/PaletteProvider'
import { assign } from 'min-dash'

export default class CustomPaletteProvider extends PaletteProvider {
  private elementFactory: ElementFactory
  private create: Create
  private readonly translate: Translate

  constructor(
    palette: Palette,
    create: Create,
    elementFactory: ElementFactory,
    spaceTool: SpaceTool,
    lassoTool: LassoTool,
    handTool: HandTool,
    globalConnect: GlobalConnect,
    translate: Translate,
  ) {
    super(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate)
    this.elementFactory = elementFactory
    this.create = create
    this.translate = translate
  }

  getPaletteEntries() {
    const actions: PaletteEntries = super.getPaletteEntries()
    const createUserTask = (event: Event) => {
      const userTask = this.elementFactory.createShape({ type: 'bpmn:UserTask' })
      this.create.start(event, userTask)
    }
    assign(actions, {
      'create.task': {
        group: 'activity',
        className: 'bpmn-icon-user-task',
        title: this.translate('Create user task'),
        action: {
          click: createUserTask,
          dragstart: createUserTask,
        },
      },
    })
    const createServiceTask = (event: Event) => {
      const userTask = this.elementFactory.createShape({ type: 'bpmn:ServiceTask' })
      this.create.start(event, userTask)
    }
    assign(actions, {
      'create.service-task': {
        group: 'activity',
        className: 'bpmn-icon-service-task',
        title: this.translate('Create service task'),
        action: {
          click: createServiceTask,
          dragstart: createServiceTask,
        },
      },
    })
    delete actions['create.group']
    delete actions['create.data-object']
    delete actions['create.data-store']
    return actions
  }
}
