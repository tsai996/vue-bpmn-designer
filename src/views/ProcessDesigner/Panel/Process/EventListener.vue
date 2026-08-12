<script setup lang="ts">
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import type { AnyEventListener } from '@/types'
import { useBpmnContextService } from '@/hooks/useService.ts'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import {
  addExtensionElements,
  getExtensionElementsList,
  removeExtensionElements,
} from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'
import EventListenerDrawer from '@/views/ProcessDesigner/Panel/Process/EventListenerDrawer.vue'

const { getService, updateProperties, selectedElement } = useBpmnContextService()
const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
const events = ref<AnyEventListener[]>([])
const eventListenerDrawerRef = ref<InstanceType<typeof EventListenerDrawer>>()
const editEventListener = (eventListener?: AnyEventListener) => {
  eventListenerDrawerRef.value?.openDrawer(eventListener)
}
const removeEventListener = (eventListener: AnyEventListener) => {
  const { element } = eventListener
  if (element) {
    removeExtensionElements(selectedElement, element)
  }
  loadEventListeners()
}
const confirmEventListener = (eventListener: AnyEventListener) => {
  const { element, events } = eventListener
  const properties: Record<string, any> = {
    events: events,
    entityType: undefined,
    class: undefined,
    delegateExpression: undefined,
    messageName: undefined,
    errorCode: undefined,
    signalName: undefined,
    throwEvent: undefined,
  }
  if ('throwEvent' in eventListener) {
    properties.throwEvent = eventListener.throwEvent
    properties[eventListener.type] = eventListener.value
  } else {
    properties.entityType = eventListener.entityType
    properties[eventListener.type] = eventListener.value
  }
  if (element) {
    updateProperties(properties, element)
  } else {
    const eventListenerElement = bpmnFactory?.create('flowable:EventListener', properties)
    addExtensionElements(selectedElement, eventListenerElement)
  }
  loadEventListeners()
}
const loadEventListeners = () => {
  const listenerElements = getExtensionElementsList(selectedElement, 'flowable:EventListener')
  events.value = listenerElements.map((e) => {
    const throwEvent = e.get('throwEvent')
    if (throwEvent) {
      const type = e.get('messageName')
        ? 'messageName'
        : e.get('errorCode')
          ? 'errorCode'
          : 'signalName'
      return {
        events: e.get('events'),
        rethrowEvent: true,
        element: e,
        throwEvent: throwEvent,
        type: type,
        value: e.get(type),
      }
    } else {
      const type = e.get('class') ? 'class' : 'delegateExpression'
      return {
        events: e.get('events'),
        rethrowEvent: false,
        element: e,
        type: type,
        value: e.get(type),
        entityType: e.get('entityType'),
      }
    }
  })
}
onMounted(() => {
  loadEventListeners()
})
</script>

<template>
  <div class="event-container">
    <div class="event-header">
      <el-text>{{ $tu('事件监听器') }}</el-text>
      <el-button type="primary" link :icon="Plus" @click="editEventListener()">{{
        $t('ui.add')
      }}</el-button>
    </div>
    <el-table :data="events" height="200px">
      <el-table-column prop="events" show-overflow-tooltip :label="$tu('事件')"></el-table-column>
      <el-table-column prop="type" show-overflow-tooltip :label="$tu('类型')"></el-table-column>
      <el-table-column prop="value" show-overflow-tooltip :label="$tu('监听')"></el-table-column>
      <el-table-column :label="$t('ui.operation')" min-width="63px" align="center">
        <template #default="{ row }">
          <el-space>
            <el-button
              type="primary"
              :icon="EditPen"
              link
              @click="editEventListener(row)"
            ></el-button>
            <el-popconfirm :title="$t('ui.confirmDeleteEvent')" @confirm="removeEventListener(row)">
              <template #reference>
                <el-button type="danger" :icon="Delete" link></el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <EventListenerDrawer ref="eventListenerDrawerRef" @confirm="confirmEventListener" />
  </div>
</template>

<style scoped lang="scss">
.event-container {
  .event-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 7px 7px;
  }
}
</style>
