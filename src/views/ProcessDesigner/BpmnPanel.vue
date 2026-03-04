<script setup lang="ts">
import { type Component, h, nextTick, ref, shallowRef, type VNode } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import type { Element } from 'bpmn-js/lib/model/Types'
import type ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
import UserTask from './Panel/UserTask/index.vue'
import TaskListener from './Panel/UserTask/TaskListener.vue'
import Process from './Panel/Process/index.vue'
import ExclusiveGateway from './Panel/ExclusiveGateway/index.vue'
import ServiceTask from './Panel/ServiceTask/index.vue'
import CallActivity from './Panel/CallActivity/index.vue'
import HttpTask from './Panel/HttpTask/index.vue'
import CamelTask from './Panel/CamelTask/index.vue'
import DecisionTask from './Panel/DecisionTask/index.vue'
import ShellTask from './Panel/ShellTask/index.vue'
import EmailTask from './Panel/EmailTask/index.vue'
import MuleTask from './Panel/MuleTask/index.vue'
import JumpTask from './Panel/JumpTask/index.vue'
import CcTask from './Panel/CcTask/index.vue'
import ExternalTask from './Panel/ExternalTask/index.vue'
import VariableEvent from './Panel/VariableEvent/index.vue'
import BusinessRuleTask from './Panel/BusinessRuleTask/index.vue'
import StartEvent from './Panel/StartEvent/index.vue'
import ScriptTask from './Panel/ScriptTask/index.vue'
import AdHocSubProcess from './Panel/AdHocSubProcess/index.vue'
import EscalationEvent from './Panel/EscalationEvent/index.vue'
import MessageEvent from './Panel/MessageEvent/index.vue'
import CompensateEvent from './Panel/CompensateEvent/index.vue'
import ConditionalEvent from './Panel/ConditionalEvent/index.vue'
import TerminateEvent from './Panel/TerminateEvent/index.vue'
import ErrorEvent from './Panel/ErrorEvent/index.vue'
import SignalEvent from './Panel/SignalEvent/index.vue'
import TimerEvent from './Panel/TimerEvent/index.vue'
import BaseActivity from './Panel/BaseActivity/index.vue'
import SequenceFlow from './Panel/SequenceFlow/index.vue'
import EventListener from './Panel/Process/EventListener.vue'
import DataObjects from './Panel/Process/DataObjects.vue'
import GlobalEvents from './Panel/Process/GlobalEvents.vue'
import FormPermissions from './Panel/UserTask/FormPermissions.vue'
import MultiInstance from './Panel/MultiInstance/index.vue'
import Advanced from './Panel/BaseActivity/Advanced.vue'
import Participant from './Panel/Participant/index.vue'
import type EventBus from 'diagram-js/lib/core/EventBus'
import type Canvas from 'diagram-js/lib/core/Canvas'
import { debounce, find } from 'min-dash'
import type { RootLike } from 'diagram-js/lib/model/Types'
import type { Injector } from 'didi'
import { useBpmnContextService } from '@/hooks/useService.ts'
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil'
import { isEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'
import { isConditionalSource } from '@/views/ProcessDesigner/utils/ElementUtil.ts'

defineOptions({
  name: 'BpmnPanel',
})
const props = defineProps<{
  modeler: BpmnModeler
}>()
const eventBus = props.modeler.get<EventBus>('eventBus')
const canvas = props.modeler.get<Canvas>('canvas')
const injector = props.modeler.get<Injector>('injector')
const elementRegistry = props.modeler.get<ElementRegistry>('elementRegistry')
const selectedElement = shallowRef<Element>()
const renderComponent = shallowRef<Component>(BaseActivity)
const renderKey = ref('')
const renderToken = ref('')
const PANEL_COMPONENTS = {
  MessageEvent,
  BusinessRuleTask,
  CallActivity,
  ScriptTask,
  StartEvent,
  UserTask,
  TaskListener,
  HttpTask,
  CamelTask,
  ShellTask,
  DecisionTask,
  MuleTask,
  JumpTask,
  EmailTask,
  CcTask,
  ExternalTask,
  ServiceTask,
  GlobalEvents,
  FormPermissions,
  Process,
  EventListener,
  DataObjects,
  SequenceFlow,
  CompensateEvent,
  VariableEvent,
  ConditionalEvent,
  EscalationEvent,
  TerminateEvent,
  SignalEvent,
  ErrorEvent,
  TimerEvent,
  AdHocSubProcess,
  Participant,
  MultiInstance,
  ExclusiveGateway,
  Advanced,
} as const

type PanelComponentKey = keyof typeof PANEL_COMPONENTS
type PanelSlotName = 'default' | 'general' | 'basic' | 'other'
type PanelSlots = Record<PanelSlotName, PanelComponentKey[]>

eventBus.on('selection.changed', (e: { newSelection: Element[] }) => {
  onSelectionChanged(e)
})
eventBus.on('elements.changed', (e) => {
  onElementsChanged(e)
})
eventBus.on('root.added', (e) => {
  onRootAdded(e)
})
eventBus.on('replace.end', (e) => {
  onReplaceEnd(e)
})
const onReplaceEnd = (e: any) => {
  const { element, newElement } = e
  if (element && newElement) {
    _update(newElement)
  }
}
const onRootAdded = (e: any) => {
  let element = e.element
  if (!element) {
    element = canvas.getRootElement()
  }
  if (isImplicitRoot(element)) {
    return
  }
  _update(element)
}
const onSelectionChanged = (e: any) => {
  const { newSelection = [] } = e
  const newElement = newSelection[0]
  const rootElement = canvas.getRootElement()
  if (isImplicitRoot(rootElement)) {
    return
  }
  _update(newElement || rootElement)
}
const onElementsChanged = (e: any) => {
  const elements = e.elements
  if (selectedElement.value) {
    const updatedElement = findElement(elements, selectedElement.value)
    if (updatedElement && elementExists(updatedElement, elementRegistry)) {
      useBpmnContextService({
        selectedElement: updatedElement,
        injector,
      })
      // _update(updatedElement)
    }
  }
}
const _update = debounce((element: Element) => {
  if (!element) {
    return
  }
  let newSelectedElement = element
  if (newSelectedElement && newSelectedElement.type === 'label') {
    newSelectedElement = newSelectedElement.labelTarget
  }
  selectedElement.value = newSelectedElement
  useBpmnContextService({
    selectedElement: newSelectedElement,
    injector,
  })
  setCurrentComponents(newSelectedElement)
  nextTick(() => {
    eventBus.fire('propertiesPanel.updated', { element: newSelectedElement })
  })
}, 100)
const setCurrentComponents = (element: Element) => {
  const businessObject = getBusinessObject(element)
  const slots: PanelSlots = {
    default: [],
    general: [],
    basic: [],
    other: [],
  }
  if (
    isEventDefinition(element, 'bpmn:CompensateEventDefinition') &&
    !is(element, 'bpmn:BoundaryEvent')
  ) {
    slots.basic.push('CompensateEvent')
  } else if (isEventDefinition(element, 'bpmn:MessageEventDefinition')) {
    slots.basic.push('MessageEvent')
  } else if (isEventDefinition(element, 'flowable:VariableListenerEventDefinition')) {
    slots.basic.push('VariableEvent')
  } else if (isEventDefinition(element, 'bpmn:ConditionalEventDefinition')) {
    slots.basic.push('ConditionalEvent')
  } else if (isEventDefinition(element, 'bpmn:EscalationEventDefinition')) {
    slots.basic.push('EscalationEvent')
  } else if (isEventDefinition(element, 'bpmn:SignalEventDefinition')) {
    slots.basic.push('SignalEvent')
  } else if (isEventDefinition(element, 'bpmn:ErrorEventDefinition')) {
    slots.basic.push('ErrorEvent')
  } else if (isEventDefinition(element, 'bpmn:TerminateEventDefinition')) {
    slots.basic.push('TerminateEvent')
  } else if (isEventDefinition(element, 'bpmn:TimerEventDefinition')) {
    slots.basic.push('TimerEvent')
  } else if (is(element, 'bpmn:ReceiveTask')) {
    // slots.basic.push(CACHE_COMPONENTS.MessageEvent)
  } else if (is(element, 'bpmn:BusinessRuleTask')) {
    slots.basic.push('BusinessRuleTask')
  } else if (is(element, 'bpmn:CallActivity')) {
    slots.basic.push('CallActivity')
  } else if (is(element, 'bpmn:ScriptTask')) {
    slots.basic.push('ScriptTask')
  } else if (is(element, 'bpmn:ExclusiveGateway') && element.outgoing.length) {
    // slots.basic.push(CACHE_COMPONENTS.ExclusiveGateway)
  } else if (is(element, 'bpmn:StartEvent')) {
    slots.general.push('StartEvent')
    if (is(element.parent, 'bpmn:Process')) {
      slots.default.push('FormPermissions')
    }
  } else if (is(element, 'bpmn:AdHocSubProcess')) {
    slots.basic.push('AdHocSubProcess')
  } else if (is(element, 'bpmn:Participant')) {
    slots.basic.push('Participant')
  } else if (is(element, 'bpmn:UserTask')) {
    slots.basic.push('UserTask')
    slots.other.push('TaskListener')
    slots.default.push('FormPermissions')
  } else if (is(element, 'bpmn:ServiceTask')) {
    if (businessObject.type === 'http') {
      slots.basic.push('HttpTask')
    } else if (businessObject.type === 'camel') {
      slots.basic.push('CamelTask')
    } else if (businessObject.type === 'shell') {
      slots.basic.push('ShellTask')
    } else if (businessObject.type === 'email') {
      slots.basic.push('EmailTask')
    } else if (businessObject.type === 'cc') {
      slots.basic.push('CcTask')
    } else if (businessObject.type === 'external-worker') {
      slots.basic.push('ExternalTask')
    } else if (businessObject.type === 'dmn') {
      slots.basic.push('DecisionTask')
    } else if (businessObject.type === 'mule') {
      slots.basic.push('MuleTask')
    } else if (businessObject.type === 'jump') {
      slots.basic.push('JumpTask')
    } else {
      slots.basic.push('ServiceTask')
    }
  } else if (is(element, 'bpmn:Process')) {
    slots.default.push('GlobalEvents')
    slots.basic.push('Process')
    slots.other.push('EventListener')
    slots.other.push('DataObjects')
  } else if (is(element, 'bpmn:SubProcess')) {
    slots.other.push('DataObjects')
  } else if (is(element, 'bpmn:SequenceFlow') && isConditionalSource(businessObject.sourceRef)) {
    slots.basic.push('SequenceFlow')
  }
  if (is(element, 'bpmn:Activity')) {
    // slots.basic.push(CACHE_COMPONENTS.MultiInstance)
    // slots.basic.push(CACHE_COMPONENTS.Advanced)
  }
  slots.basic.push('Advanced')

  const panelSignature = (Object.keys(slots) as PanelSlotName[])
    .map((slotName) => `${slotName}:${slots[slotName].join(',')}`)
    .join('|')
  const nextRenderToken = `${element.id}|${panelSignature}`
  if (nextRenderToken === renderToken.value) {
    return
  }

  renderToken.value = nextRenderToken
  const functionSlots = Object.fromEntries(
    Object.entries(slots)
      .map(([key, value]) => [key, () => value.map((componentKey) => h(PANEL_COMPONENTS[componentKey]) as VNode)]),
  )
  renderComponent.value = h(BaseActivity, null, functionSlots)
  renderKey.value = nextRenderToken
}
const isImplicitRoot = (element: RootLike) => {
  return element && element.isImplicit
}
const findElement = (elements: Element[], element: Element) => {
  return find(elements, (e: Element) => e === element)
}
const elementExists = (element: Element, elementRegistry: ElementRegistry) => {
  return element && elementRegistry.get(element.id)
}
</script>

<template>
  <div class="panel-container">
    <!--size="small" label-position="left" label-width="90px"-->
    <el-form v-bind="$attrs" label-width="110px">
      <component :is="renderComponent" :key="renderKey" />
    </el-form>
  </div>
</template>
<style scoped lang="scss">
.panel-container {
  height: 100%;
}

:deep {
  .el-form,
  .el-tabs,
  .el-tab-pane {
    height: 100%;
  }

  .el-collapse {
    height: calc(100% - 2px);
  }

  .el-tabs__header {
    margin: 0;
  }
}
</style>
