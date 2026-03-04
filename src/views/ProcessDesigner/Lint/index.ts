import StaticResolver from 'bpmnlint/lib/resolver/static-resolver'
import StartEventRequired from 'bpmnlint/rules/start-event-required'
import EndEventRequired from 'bpmnlint/rules/end-event-required'
import ConditionalFlows from 'bpmnlint/rules/conditional-flows'
import adHocSubProcess from 'bpmnlint/rules/ad-hoc-sub-process'
import fakeJoin from 'bpmnlint/rules/fake-join'
import Global from 'bpmnlint/rules/global'
// import labelRequired from 'bpmnlint/rules/label-required'
import linkEvent from 'bpmnlint/rules/link-event'
import noBpmndi from 'bpmnlint/rules/no-bpmndi'
import noComplexGateway from 'bpmnlint/rules/no-complex-gateway'
import noDisconnected from 'bpmnlint/rules/no-disconnected'
import noDuplicateSequenceFlows from 'bpmnlint/rules/no-duplicate-sequence-flows'
import noGatewayJoinFork from 'bpmnlint/rules/no-gateway-join-fork'
import noImplicitSplit from 'bpmnlint/rules/no-implicit-split'
import noImplicitEnd from 'bpmnlint/rules/no-implicit-end'
import noImplicitStart from 'bpmnlint/rules/no-implicit-start'
// import noInclusiveGateway from 'bpmnlint/rules/no-inclusive-gateway'
import noOverlappingElements from 'bpmnlint/rules/no-overlapping-elements'
import singleBlankStartEvent from 'bpmnlint/rules/single-blank-start-event'
import singleEventDefinition from 'bpmnlint/rules/single-event-definition'
import subProcessBlankStartEvent from 'bpmnlint/rules/sub-process-blank-start-event'
import superfluousGateway from 'bpmnlint/rules/superfluous-gateway'
import superfluousTermination from 'bpmnlint/rules/superfluous-termination'
import activityLabelRequired from './rules/activity-label-required.ts'
import userTaskRequired from './rules/user-task-required.ts'
// import gatewayJoin from './rules/gateway-join.ts'
import serviceTaskRequired from './rules/service-task-required.ts'
import messageEventRequired from './rules/message-event-required.ts'
import compensateEventRequired from './rules/compensate-event-required.ts'
import errorEventRequired from './rules/error-event-required.ts'
import escalationEventRequired from './rules/escalation-event-required.ts'
import signalEventRequired from './rules/signal-event-required.ts'
import timerEventRequired from './rules/timer-event-required.ts'
import conditionalEventRequired from './rules/conditional-event-required.ts'
import scriptTaskRequired from './rules/script-task-required.ts'
import multiInstanceRequired from './rules/multi-instance-required.ts'
import httpTaskRequired from './rules/http-task-required.ts'
import callActivityRequired from './rules/call-activity-required.ts'
import variableEventRequired from './rules/variable-event-required.ts'
import sequenceFlowsRequired from './rules/sequence-flows-required.ts'
import eventSubProcessTypedStartEvent from './rules/event-sub-process-typed-start-event.ts'
import type { Config } from 'bpmnlint/lib/types'
// import recommended from 'bpmnlint/config/recommended'

const resolver = new StaticResolver({
  'rule:bpmnlint/ad-hoc-sub-process': adHocSubProcess,
  'rule:bpmnlint/conditional-flows': ConditionalFlows,
  'rule:bpmnlint/end-event-required': EndEventRequired,
  'rule:bpmnlint/event-sub-process-typed-start-event': eventSubProcessTypedStartEvent,
  'rule:bpmnlint/fake-join': fakeJoin,
  'rule:bpmnlint/global': Global,
  // 'rule:bpmnlint/label-required': labelRequired,
  'rule:bpmnlint/link-event': linkEvent,
  'rule:bpmnlint/no-bpmndi': noBpmndi,
  'rule:bpmnlint/no-complex-gateway': noComplexGateway,
  'rule:bpmnlint/no-disconnected': noDisconnected,
  'rule:bpmnlint/no-duplicate-sequence-flows': noDuplicateSequenceFlows,
  'rule:bpmnlint/no-gateway-join-fork': noGatewayJoinFork,
  'rule:bpmnlint/no-implicit-split': noImplicitSplit,
  'rule:bpmnlint/no-implicit-end': noImplicitEnd,
  'rule:bpmnlint/no-implicit-start': noImplicitStart,
  // 'rule:bpmnlint/no-inclusive-gateway': noInclusiveGateway,
  'rule:bpmnlint/no-overlapping-elements': noOverlappingElements,
  'rule:bpmnlint/single-blank-start-event': singleBlankStartEvent,
  'rule:bpmnlint/single-event-definition': singleEventDefinition,
  'rule:bpmnlint/start-event-required': StartEventRequired,
  'rule:bpmnlint/sub-process-blank-start-event': subProcessBlankStartEvent,
  'rule:bpmnlint/superfluous-gateway': superfluousGateway,
  'rule:bpmnlint/superfluous-termination': superfluousTermination,
  'rule:bpmnlint/activity-label-required': activityLabelRequired,
  'rule:bpmnlint/user-task-required': userTaskRequired,
  'rule:bpmnlint/service-task-required': serviceTaskRequired,
  'rule:bpmnlint/message-event-required': messageEventRequired,
  'rule:bpmnlint/compensate-event-required': compensateEventRequired,
  'rule:bpmnlint/error-event-required': errorEventRequired,
  'rule:bpmnlint/escalation-event-required': escalationEventRequired,
  'rule:bpmnlint/signal-event-required': signalEventRequired,
  'rule:bpmnlint/timer-event-required': timerEventRequired,
  'rule:bpmnlint/conditional-event-required': conditionalEventRequired,
  'rule:bpmnlint/script-task-required': scriptTaskRequired,
  'rule:bpmnlint/multi-instance-required': multiInstanceRequired,
  'rule:bpmnlint/http-task-required': httpTaskRequired,
  'rule:bpmnlint/call-activity-required': callActivityRequired,
  'rule:bpmnlint/variable-event-required': variableEventRequired,
  'rule:bpmnlint/sequence-flows-required': sequenceFlowsRequired,
  // 'rule:bpmnlint/gateway-join': gatewayJoin,
})
const config: Config = {
  rules: {
    'ad-hoc-sub-process': 'error',
    'conditional-flows': 'error',
    'end-event-required': 'error',
    'event-sub-process-typed-start-event': 'error',
    'fake-join': 'warn',
    global: 'warn',
    // 'label-required': 'error',
    'link-event': 'error',
    'no-bpmndi': 'error',
    'no-complex-gateway': 'error',
    'no-disconnected': 'error',
    'no-duplicate-sequence-flows': 'error',
    'no-gateway-join-fork': 'error',
    'no-implicit-split': 'error',
    'no-implicit-end': 'error',
    'no-implicit-start': 'error',
    // 'no-inclusive-gateway': 'error',
    'no-overlapping-elements': 'warn',
    'single-blank-start-event': 'error',
    'single-event-definition': 'error',
    'start-event-required': 'error',
    'sub-process-blank-start-event': 'error',
    'superfluous-gateway': 'warn',
    'superfluous-termination': 'warn',
    'activity-label-required': 'warn',
    'user-task-required': 'error',
    'service-task-required': 'error',
    'message-event-required': 'error',
    'compensate-event-required': 'error',
    'error-event-required': 'error',
    'escalation-event-required': 'error',
    'signal-event-required': 'error',
    'timer-event-required': 'error',
    'conditional-event-required': 'error',
    'script-task-required': 'error',
    'multi-instance-required': 'error',
    'http-task-required': 'error',
    'call-activity-required': 'error',
    'variable-event-required': 'error',
    'sequence-flows-required': 'error',
    // 'gateway-join': 'error',
  },
}
export default {
  resolver,
  config,
}
