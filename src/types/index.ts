import type { Element } from 'bpmn-js/lib/model/Types'

export interface Event {
  id: string
  name: string
  element?: Element
}

export type MessageEvent = Event

export interface SignalEvent extends Event {
  'flowable:scope': string
}

export interface EscalationEvent extends Event {
  escalationCode: string
}

export interface ErrorEvent extends Event {
  errorCode: string
}

export interface Listener {
  event: string | string[]
  type: 'class' | 'expression' | 'delegateExpression'
  impl: string
  element?: Element
}

export interface EventListener {
  events: string[]
  rethrowEvent: boolean
  element?: Element
}

export interface ClassEventListener extends EventListener {
  type: 'class' | 'delegateExpression'
  value?: string
  entityType: string
}

export interface ThrowEventListener extends EventListener {
  throwEvent: 'globalSignal' | 'error' | 'signal' | 'message'
  type: 'messageName' | 'errorCode' | 'signalName'
  value?: string
}

export type AnyEventListener = ClassEventListener | ThrowEventListener

export interface ExecutionListener extends Listener {
  fields?: Field[]
}

export interface Field {
  name: string
  type: 'string' | 'stringValue' | 'expression'
  value: string
  element?: Element
}

export interface Properties {
  id: string
  name: string
  value: string
  element?: Element
}

export interface FormProperty {
  id: string
  name: string
  type: string
  required: boolean
  readable: boolean
  writable: boolean
  expression?: string
  variable?: string
  default?: string
  element?: Element
}

export interface DataObject {
  id: string
  name: string
  type: string
  value?: string | number | boolean
  element?: Element
}

export interface VariableAggregation {
  target: string
  variableType: 'createOverviewVariable' | 'storeAsTransientVariable'
  expression: string
  variables: Variable[]
  element?: Element
}

export interface Variable {
  source: string
  target: string
}

export interface MapException {
  errorCode?: string
  exceptionClass?: string
  includeChildExceptions?: boolean
}
