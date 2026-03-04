import ReplaceMenuProvider, {
  type Rules,
} from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider'
import BpmnReplace from 'bpmn-js/lib/features/replace/BpmnReplace'
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling'
import type { Translate } from 'bpmn-js/lib/features/palette/PaletteProvider'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import type { Element, Moddle } from 'bpmn-js/lib/model/Types'
import ModdleCopy from 'bpmn-js/lib/features/copy-paste/ModdleCopy'
import type {
  PopupMenuEntries,
  PopupMenuHeaderEntries,
} from 'diagram-js/lib/features/popup-menu/PopupMenuProvider'
import PopupMenu, { type PopupMenuTarget } from 'diagram-js/lib/features/popup-menu/PopupMenu'
import { filter, isArray } from 'min-dash'
import { isDifferentType } from 'bpmn-js/lib/features/popup-menu/util/TypeUtil'
import { getBusinessObject, is, isAny } from 'bpmn-js/lib/util/ModelUtil'
import type { ReplaceOption } from 'bpmn-js/lib/features/replace/ReplaceOptions'
import * as replaceOptions from 'bpmn-js/lib/features/replace/ReplaceOptions'
import * as connectorOptions from '../Connector/ConnectorOptions.ts'
import { isEventSubProcess, isExpanded } from 'bpmn-js/lib/util/DiUtil'
import type ConnectorMenuProvider from '../Connector/ConnectorMenuProvider.ts'
import { isEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'

export default class CustomPopupMenuProvider extends ReplaceMenuProvider {
  private readonly _modeling: Modeling
  private readonly _rules: Rules
  private readonly _connectorMenuProvider: ConnectorMenuProvider

  constructor(
    bpmnFactory: BpmnFactory,
    popupMenu: PopupMenu,
    modeling: Modeling,
    moddle: Moddle,
    bpmnReplace: BpmnReplace,
    rules: Rules,
    translate: Translate,
    moddleCopy: ModdleCopy,
    connectorMenuProvider: ConnectorMenuProvider,
  ) {
    super(bpmnFactory, popupMenu, modeling, moddle, bpmnReplace, rules, translate, moddleCopy)
    this._modeling = modeling
    this._rules = rules
    this._connectorMenuProvider = connectorMenuProvider
    replaceOptions.START_EVENT.splice(5, 1)
    replaceOptions.TASK.splice(0, 1)
    replaceOptions.TASK.splice(2, 1)
    replaceOptions.GATEWAY.splice(3, 1)
    replaceOptions.INTERMEDIATE_EVENT.splice(4, 1)
    replaceOptions.INTERMEDIATE_EVENT.splice(7, 2)
    /*replaceOptions.START_EVENT.push({
      label: 'Variable start event',
      actionName: 'replace-with-variable-start',
      className: 'bpmn-icon-start-event-multiple',
      target: {
        type: 'bpmn:StartEvent',
        eventDefinitionType: 'flowable:VariableListenerEventDefinition',
      },
    })*/
    replaceOptions.INTERMEDIATE_EVENT.push({
      label: 'Variable intermediate event',
      actionName: 'replace-with-variable-intermediate-catch',
      className: 'bpmn-icon-intermediate-event-catch-multiple',
      target: {
        type: 'bpmn:IntermediateCatchEvent',
        eventDefinitionType: 'flowable:VariableListenerEventDefinition',
        eventDefinitionAttrs: {
          variableChangeType: 'all',
        },
      },
    })
    replaceOptions.EVENT_SUB_PROCESS_START_EVENT.splice(7, 0, {
      label: 'Variable start event',
      actionName: 'replace-with-variable-start',
      className: 'bpmn-icon-start-event-multiple',
      target: {
        type: 'bpmn:StartEvent',
        eventDefinitionType: 'flowable:VariableListenerEventDefinition',
        isInterrupting: true,
      },
    })
    replaceOptions.EVENT_SUB_PROCESS_START_EVENT.push({
      label: 'Variable start event (non-interrupting)',
      actionName: 'replace-with-non-interrupting-variable-start',
      className: 'bpmn-icon-start-event-non-interrupting-multiple',
      target: {
        type: 'bpmn:StartEvent',
        eventDefinitionType: 'flowable:VariableListenerEventDefinition',
        isInterrupting: false,
      },
    })
    replaceOptions.BOUNDARY_EVENT.splice(8, 0, {
      label: 'Variable boundary event',
      actionName: 'replace-with-variable-boundary',
      className: 'bpmn-icon-intermediate-event-catch-multiple',
      target: {
        type: 'bpmn:BoundaryEvent',
        eventDefinitionType: 'flowable:VariableListenerEventDefinition',
        eventDefinitionAttrs: {
          variableChangeType: 'all',
        },
        cancelActivity: true,
      },
    })
    replaceOptions.BOUNDARY_EVENT.push({
      label: 'Variable boundary event (non-interrupting)',
      actionName: 'replace-with-non-interrupting-variable-boundary',
      className: 'bpmn-icon-intermediate-event-catch-non-interrupting-multiple',
      target: {
        type: 'bpmn:BoundaryEvent',
        eventDefinitionType: 'flowable:VariableListenerEventDefinition',
        eventDefinitionAttrs: {
          variableChangeType: 'all',
        },
        cancelActivity: false,
      },
    })
  }

  getPopupMenuHeaderEntries(target: PopupMenuTarget): PopupMenuHeaderEntries {
    const headerEntries = super.getPopupMenuHeaderEntries(target)
    if (!Array.isArray(headerEntries)) {
      if (headerEntries['toggle-loop']) {
        delete headerEntries['toggle-loop']
      }
    }
    const businessObject = getBusinessObject(target)
    const isBoundaryEvent = is(businessObject, 'bpmn:BoundaryEvent')
    const isStartEventInSubProcess =
      is(businessObject, 'bpmn:StartEvent') && isEventSubProcess(businessObject.$parent)
    if (isBoundaryEvent || isStartEventInSubProcess) {
      if (isEventDefinition(target as Element, 'flowable:VariableListenerEventDefinition')) {
        return {
          ...headerEntries,
          ...super._getNonInterruptingHeaderEntries(target),
        }
      }
    }
    return headerEntries
  }

  getPopupMenuEntries(target: PopupMenuTarget): PopupMenuEntries {
    return this._getPopupMenuEntries(target)
  }

  _getPopupMenuEntries(target: PopupMenuTarget): PopupMenuEntries {
    if (isArray(target) || !this._rules.allowed('shape.replace', { element: target })) {
      return {}
    }
    const businessObject = target.businessObject
    let filteredReplaceOptions = []
    const element = target as Element
    const isEqual = (element: Element) => {
      const different = isDifferentType(element)
      return (entry: ReplaceOption) => {
        const result = different(entry)
        if (result) {
          const eventDefinitionType = entry.target?.eventDefinitionType
          if (eventDefinitionType) {
            return !isEventDefinition(element, eventDefinitionType)
          }
        }
        return result
      }
    }
    const differentType = isEqual(element)
    if (is(businessObject, 'bpmn:DataObjectReference')) {
      return this._createEntries(element, replaceOptions.DATA_OBJECT_REFERENCE)
    }
    if (is(businessObject, 'bpmn:DataStoreReference') && !is(target.parent, 'bpmn:Collaboration')) {
      return this._createEntries(target, replaceOptions.DATA_STORE_REFERENCE)
    }
    // start events outside sub processes
    if (is(businessObject, 'bpmn:StartEvent') && !is(businessObject.$parent, 'bpmn:SubProcess')) {
      filteredReplaceOptions = filter(replaceOptions.START_EVENT, differentType)
      return this._createEntries(target, filteredReplaceOptions)
    }
    // expanded/collapsed pools
    if (is(businessObject, 'bpmn:Participant')) {
      filteredReplaceOptions = filter(
        replaceOptions.PARTICIPANT,
        (replaceOption: ReplaceOption) => {
          return isExpanded(element) !== replaceOption.target?.isExpanded
        },
      )
      return this._createEntries(target, filteredReplaceOptions)
    }
    // start events inside event sub processes
    if (is(businessObject, 'bpmn:StartEvent') && isEventSubProcess(businessObject.$parent)) {
      filteredReplaceOptions = filter(
        replaceOptions.EVENT_SUB_PROCESS_START_EVENT,
        (replaceOption: ReplaceOption) => {
          const target = replaceOption.target
          const isInterrupting = target?.isInterrupting !== false
          const isInterruptingEqual = businessObject.isInterrupting === isInterrupting
          // filters elements which types and event definition are equal but have have different interrupting types
          return (
            differentType(replaceOption) || (!differentType(replaceOption) && !isInterruptingEqual)
          )
        },
      )
      return this._createEntries(target, filteredReplaceOptions)
    }
    // start events inside sub processes
    if (
      is(businessObject, 'bpmn:StartEvent') &&
      !isEventSubProcess(businessObject.$parent) &&
      is(businessObject.$parent, 'bpmn:SubProcess')
    ) {
      filteredReplaceOptions = filter(replaceOptions.START_EVENT_SUB_PROCESS, differentType)
      return this._createEntries(target, filteredReplaceOptions)
    }
    // end events
    if (is(businessObject, 'bpmn:EndEvent')) {
      filteredReplaceOptions = filter(replaceOptions.END_EVENT, (replaceOption: ReplaceOption) => {
        const target = replaceOption.target
        // hide cancel end events outside transactions
        if (
          target?.eventDefinitionType == 'bpmn:CancelEventDefinition' &&
          !is(businessObject.$parent, 'bpmn:Transaction')
        ) {
          return false
        }
        return differentType(replaceOption)
      })
      return this._createEntries(target, filteredReplaceOptions)
    }
    // boundary events
    if (is(businessObject, 'bpmn:BoundaryEvent')) {
      filteredReplaceOptions = filter(
        replaceOptions.BOUNDARY_EVENT,
        (replaceOption: ReplaceOption) => {
          const target = replaceOption.target
          if (
            target?.eventDefinitionType == 'bpmn:CancelEventDefinition' &&
            !is(businessObject.attachedToRef, 'bpmn:Transaction')
          ) {
            return false
          }
          const cancelActivity = target?.cancelActivity !== false
          const isCancelActivityEqual = businessObject.cancelActivity == cancelActivity
          return (
            differentType(replaceOption) ||
            (!differentType(replaceOption) && !isCancelActivityEqual)
          )
        },
      )
      return this._createEntries(target, filteredReplaceOptions)
    }
    // intermediate events
    if (isAny(businessObject, ['bpmn:IntermediateCatchEvent', 'bpmn:IntermediateThrowEvent'])) {
      filteredReplaceOptions = filter(replaceOptions.INTERMEDIATE_EVENT, differentType)
      return this._createEntries(target, filteredReplaceOptions)
    }
    // gateways
    if (is(businessObject, 'bpmn:Gateway')) {
      filteredReplaceOptions = filter(replaceOptions.GATEWAY, differentType)
      return this._createEntries(target, filteredReplaceOptions)
    }
    // transactions
    if (is(businessObject, 'bpmn:Transaction')) {
      filteredReplaceOptions = filter(replaceOptions.TRANSACTION, differentType)
      return this._createEntries(target, filteredReplaceOptions)
    }
    // expanded event sub processes
    if (isEventSubProcess(businessObject) && isExpanded(element)) {
      filteredReplaceOptions = filter(replaceOptions.EVENT_SUB_PROCESS, differentType)
      return this._createEntries(target, filteredReplaceOptions)
    }
    // expanded ad hoc sub processes
    if (is(businessObject, 'bpmn:AdHocSubProcess') && isExpanded(element)) {
      filteredReplaceOptions = filter(replaceOptions.AD_HOC_SUBPROCESS_EXPANDED, differentType)
      return this._createEntries(target, filteredReplaceOptions)
    }
    // expanded sub processes
    if (is(businessObject, 'bpmn:SubProcess') && isExpanded(element)) {
      filteredReplaceOptions = filter(replaceOptions.SUBPROCESS_EXPANDED, differentType)
      return this._createEntries(target, filteredReplaceOptions)
    }
    // collapsed sub process or collapsed ad hoc sub process
    if (is(businessObject, 'bpmn:SubProcess') && !isExpanded(element)) {
      filteredReplaceOptions = filter(replaceOptions.TASK, (replaceOption: ReplaceOption) => {
        const isTargetSameType = replaceOption.target?.type === target.type
        const isTargetExpanded = replaceOption.target?.isExpanded === true
        // Collapsed subprocess cannot be replaced with itself or expanded subprocess of different type.
        return isTargetSameType === isTargetExpanded
      })
      return this._createEntries(target, filteredReplaceOptions)
    }
    // sequence flows
    if (is(businessObject, 'bpmn:SequenceFlow')) {
      return this._createSequenceFlowEntries(target, replaceOptions.SEQUENCE_FLOW)
    }
    // flow nodes
    if (is(businessObject, 'bpmn:FlowNode')) {
      filteredReplaceOptions = filter(replaceOptions.TASK, (replaceOption: ReplaceOption) => {
        const result = differentType(replaceOption)
        if (is(element, 'bpmn:ServiceTask') && businessObject.get('type')) {
          return true
        }
        return result
      })
      const entries = this._createEntries(target, filteredReplaceOptions)
      return {
        ...entries,
        ...this._connectorMenuProvider.createEntries(element, connectorOptions.TASK_CONNECTOR),
      }
    }
    return {}
  }
}
CustomPopupMenuProvider.$inject.push('connectorMenuProvider')
