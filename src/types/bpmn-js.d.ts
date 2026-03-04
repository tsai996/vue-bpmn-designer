declare module 'bpmn-js/lib/features/replace/BpmnReplace' {
  import type { Element, Shape } from 'bpmn-js/lib/model/Types'
  import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
  import type ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
  import type ModdleCopy from 'bpmn-js/lib/features/copy-paste/ModdleCopy'
  import type Modeling from 'bpmn-js/lib/features/modeling/Modeling'
  import type Replace from 'diagram-js/lib/features/replace/Replace'
  import type Rules from 'diagram-js/lib/features/rules/Rules'
  export type { Hints } from 'bpmn-js/lib/features/replace/BpmnReplace'

  export type TargetElement = {
    type: string
    cancelActivity?: boolean
    instantiate?: boolean
    eventGatewayType?: string
    triggeredByEvent?: boolean
    isInterrupting?: boolean
    collapsed?: boolean
    isExpanded?: boolean
    eventDefinitionType?: string
    eventDefinitionAttrs?: any
    host?: Shape
  }

  export default class BpmnReplace {
    static $inject: string[]

    constructor(
      bpmnFactory: BpmnFactory,
      elementFactory: ElementFactory,
      moddleCopy: ModdleCopy,
      modeling: Modeling,
      replace: Replace,
      rules: Rules,
    )

    replaceElement(element: Element, targetElement: TargetElement, hints?: Hints): Element
  }
}

declare module 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider' {
  import type { Rules, Translate } from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider'
  import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
  import type PopupMenuProvider, {
    PopupMenuEntries,
    PopupMenuEntry,
    PopupMenuHeaderEntries,
  } from 'diagram-js/lib/features/popup-menu/PopupMenuProvider'
  import type PopupMenu, { PopupMenuTarget } from 'diagram-js/lib/features/popup-menu/PopupMenu'
  import type Modeling from 'bpmn-js/lib/features/modeling/Modeling'
  import type { Moddle } from 'bpmn-js/lib/model/Types'
  import type { ReplaceOption } from 'bpmn-js/lib/features/replace/ReplaceOptions'
  import type { Element } from 'diagram-js/lib/model/Types'
  import type BpmnReplace from 'bpmn-js/lib/features/replace/BpmnReplace'
  import type ModdleCopy from 'bpmn-js/lib/features/copy-paste/ModdleCopy'

  export default class ReplaceMenuProvider implements PopupMenuProvider {
    static $inject: string[]

    constructor(
      bpmnFactory: BpmnFactory,
      popupMenu: PopupMenu,
      modeling: Modeling,
      moddle: Moddle,
      bpmnReplace: BpmnReplace,
      rules: Rules,
      translate: Translate,
      moddleCopy: ModdleCopy,
    )

    getPopupMenuEntries(target: PopupMenuTarget): PopupMenuEntries

    getPopupMenuHeaderEntries(target: PopupMenuTarget): PopupMenuHeaderEntries

    _createEntries(target: Element, replaceOptions: ReplaceOption[]): PopupMenuEntries

    _createEntry(replaceOption: ReplaceOption, target: Element, action?: () => void): PopupMenuEntry

    _createSequenceFlowEntries(target: Element, replaceOptions: ReplaceOption[])

    _getNonInterruptingHeaderEntries(element: PopupMenuTarget): PopupMenuHeaderEntries
  }
  export type Rules = any
  export type ReplaceOption = any
}

declare module 'bpmn-js/lib/features/popup-menu/util/TypeUtil' {
  import type { Element } from 'bpmn-js/lib/model/Types'
  import type { ReplaceOption } from 'bpmn-js/lib/features/replace/ReplaceOptions'

  export function isDifferentType(element: Element): DifferentTypeValidator
  export type DifferentTypeValidator = (entry: ReplaceOption) => boolean
}
