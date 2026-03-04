<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import MessageEventDrawer from './MessageEventDrawer.vue'
import ErrorEventDrawer from './ErrorEventDrawer.vue'
import SignalEventDrawer from './SignalEventDrawer.vue'
import EscalationEventDrawer from './EscalationEventDrawer.vue'
import {
  createOrUpdateRootElement,
  findRootElementsByType,
  removeRootElement,
} from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { useBpmnContextService } from '@/hooks/useService.ts'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import type { ErrorEvent, EscalationEvent, MessageEvent, SignalEvent } from '@/types'

const { selectedElement } = useBpmnContextService()
const messages = ref<MessageEvent[]>([])
const errors = ref<ErrorEvent[]>([])
const signals = ref<SignalEvent[]>([])
const escalations = ref<EscalationEvent[]>([])
const messageEventDrawerRef = ref<InstanceType<typeof MessageEventDrawer>>()
const errorEventDrawerRef = ref<InstanceType<typeof ErrorEventDrawer>>()
const signalEventDrawerRef = ref<InstanceType<typeof SignalEventDrawer>>()
const escalationEventDrawerRef = ref<InstanceType<typeof EscalationEventDrawer>>()
const addMessageEvent = (message?: MessageEvent) => {
  messageEventDrawerRef.value?.openDrawer(message)
}
const removeMessageEvent = (message: MessageEvent) => {
  if (message.element) {
    removeRootElement(message.element)
  }
  // removeEventDefinition(message.id, 'bpmn:Message')
  loadEvents()
}
const addErrorEvent = (error?: ErrorEvent) => {
  errorEventDrawerRef.value?.openDrawer(error)
}
const removeErrorEvent = (error: ErrorEvent) => {
  if (error.element) {
    removeRootElement(error.element)
  }
  // removeEventDefinition(error.id, 'bpmn:Error')
  loadEvents()
}
const addSignalEvent = (signal?: SignalEvent) => {
  signalEventDrawerRef.value?.openDrawer(signal)
}
const removeSignalEvent = (signal: SignalEvent) => {
  if (signal.element) {
    removeRootElement(signal.element)
  }
  // removeEventDefinition(signal.id, 'bpmn:Signal')
  loadEvents()
}
const addEscalationEvent = (escalation?: EscalationEvent) => {
  escalationEventDrawerRef.value?.openDrawer(escalation)
}
const removeEscalationEvent = (escalation: EscalationEvent) => {
  if (escalation.element) {
    removeRootElement(escalation.element)
  }
  // removeEventDefinition(escalation.id, 'bpmn:Escalation')
  loadEvents()
}
const confirmMessageEvent = (messageEvent: MessageEvent) => {
  const { element, ...properties } = messageEvent
  createOrUpdateRootElement(properties, element ? element : 'bpmn:Message')
  // createOrUpdateEventDefinition(properties, 'bpmn:Message')
  loadEvents()
}
const confirmErrorEvent = (errorEvent: ErrorEvent) => {
  const { element, ...properties } = errorEvent
  createOrUpdateRootElement(properties, element ? element : 'bpmn:Error')
  // createOrUpdateEventDefinition(properties, 'bpmn:Error')
  loadEvents()
}
const confirmEscalationEvent = (escalationEvent: EscalationEvent) => {
  const { element, ...properties } = escalationEvent
  createOrUpdateRootElement(properties, element ? element : 'bpmn:Escalation')
  // createOrUpdateEventDefinition(properties, 'bpmn:Escalation')
  loadEvents()
}
const confirmSignalEvent = (signalEvent: SignalEvent) => {
  const { element, ...properties } = signalEvent
  createOrUpdateRootElement(properties, element ? element : 'bpmn:Signal')
  // createOrUpdateEventDefinition(properties, 'bpmn:Signal')
  loadEvents()
}
const loadEvents = () => {
  const businessObject = getBusinessObject(selectedElement)
  const messageElements = findRootElementsByType(businessObject, 'bpmn:Message')
  messages.value = messageElements.map((item) => {
    return {
      id: item.id,
      name: item.name,
      element: item,
    }
  })
  const errorElements = findRootElementsByType(businessObject, 'bpmn:Error')
  errors.value = errorElements.map((item) => {
    return {
      id: item.id,
      name: item.name,
      errorCode: item.errorCode,
      element: item,
    }
  })
  const signalElements = findRootElementsByType(businessObject, 'bpmn:Signal')
  signals.value = signalElements.map((item) => {
    return {
      id: item.get('id'),
      name: item.get('name'),
      'flowable:scope': item.get('flowable:scope'),
      element: item,
    }
  })
  const escalationElements = findRootElementsByType(businessObject, 'bpmn:Escalation')
  escalations.value = escalationElements.map((item) => {
    return {
      id: item.id,
      name: item.name,
      escalationCode: item.escalationCode,
      element: item,
    }
  })
}
onMounted(() => {
  loadEvents()
})
</script>

<template>
  <el-tab-pane label="全局事件" name="globalEvents">
    <el-scrollbar>
      <MessageEventDrawer ref="messageEventDrawerRef" @confirm="confirmMessageEvent" />
      <ErrorEventDrawer ref="errorEventDrawerRef" @confirm="confirmErrorEvent" />
      <SignalEventDrawer ref="signalEventDrawerRef" @confirm="confirmSignalEvent" />
      <EscalationEventDrawer ref="escalationEventDrawerRef" @confirm="confirmEscalationEvent" />
      <div class="events-list">
        <div class="events-container">
          <div class="events-header">
            <el-text> 消息定义</el-text>
            <el-button type="primary" link :icon="Plus" @click="addMessageEvent()">添加</el-button>
          </div>
          <el-table :data="messages" height="200px">
            <el-table-column prop="id" show-overflow-tooltip label="id"></el-table-column>
            <el-table-column prop="name" show-overflow-tooltip label="名称"></el-table-column>
            <el-table-column label="操作" min-width="45px" align="center">
              <template #default="{ row }">
                <el-space>
                  <el-button type="primary" :icon="EditPen" link @click="addMessageEvent(row)" />
                  <el-popconfirm title="您确定要删除该事件吗？" @confirm="removeMessageEvent(row)">
                    <template #reference>
                      <el-button type="danger" :icon="Delete" link></el-button>
                    </template>
                  </el-popconfirm>
                </el-space>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="events-container">
          <div class="events-header">
            <el-text> 错误定义</el-text>
            <el-button type="primary" link :icon="Plus" @click="addErrorEvent()">添加</el-button>
          </div>
          <el-table :data="errors" height="200px">
            <el-table-column prop="id" show-overflow-tooltip label="id"></el-table-column>
            <el-table-column prop="name" show-overflow-tooltip label="名称"></el-table-column>
            <el-table-column label="操作" min-width="45px" align="center">
              <template #default="{ row }">
                <el-space>
                  <el-button
                    type="primary"
                    :icon="EditPen"
                    link
                    @click="addErrorEvent(row)"
                  ></el-button>
                  <el-popconfirm title="您确定要删除该事件吗？" @confirm="removeErrorEvent(row)">
                    <template #reference>
                      <el-button type="danger" :icon="Delete" link></el-button>
                    </template>
                  </el-popconfirm>
                </el-space>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="events-container">
          <div class="events-header">
            <el-text> 信号定义</el-text>
            <el-button type="primary" link :icon="Plus" @click="addSignalEvent()">添加</el-button>
          </div>
          <el-table :data="signals" height="200px">
            <el-table-column prop="id" show-overflow-tooltip label="id"></el-table-column>
            <el-table-column prop="name" show-overflow-tooltip label="名称"></el-table-column>
            <el-table-column label="操作" min-width="45px" align="center">
              <template #default="{ row }">
                <el-space>
                  <el-button
                    type="primary"
                    :icon="EditPen"
                    link
                    @click="addSignalEvent(row)"
                  ></el-button>
                  <el-popconfirm title="您确定要删除该事件吗？" @confirm="removeSignalEvent(row)">
                    <template #reference>
                      <el-button type="danger" :icon="Delete" link></el-button>
                    </template>
                  </el-popconfirm>
                </el-space>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="events-container">
          <div class="events-header">
            <el-text> 升级定义</el-text>
            <el-button type="primary" link :icon="Plus" @click="addEscalationEvent()"
              >添加
            </el-button>
          </div>
          <el-table :data="escalations" height="200px">
            <el-table-column prop="id" show-overflow-tooltip label="id"></el-table-column>
            <el-table-column prop="name" show-overflow-tooltip label="名称"></el-table-column>
            <el-table-column label="操作" min-width="45px" align="center">
              <template #default="{ row }">
                <el-space>
                  <el-button
                    type="primary"
                    :icon="EditPen"
                    link
                    @click="addEscalationEvent(row)"
                  ></el-button>
                  <el-popconfirm
                    title="您确定要删除该事件吗？"
                    @confirm="removeEscalationEvent(row)"
                  >
                    <template #reference>
                      <el-button type="danger" :icon="Delete" link></el-button>
                    </template>
                  </el-popconfirm>
                </el-space>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-scrollbar>
  </el-tab-pane>
</template>

<style scoped lang="scss">
.events-list {
  height: 100%;
  padding: 10px;

  .events-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 7px 7px;
  }

  .events-container {
    margin-bottom: 15px;
  }
}
</style>
