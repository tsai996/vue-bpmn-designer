<script setup lang="ts">
import {
  findRootElementById,
  findRootElementsByType,
} from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { customRef, onMounted, ref } from 'vue'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import { useBpmnContextService } from '@/hooks/useService.ts'
import type { MessageEvent } from '@/types'
import {
  createOrUpdateEventDefinition,
  getMessageEventDefinition,
} from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'
import MessageEventDrawer from '../Process/MessageEventDrawer.vue'
import { Plus } from '@element-plus/icons-vue'

defineOptions({
  name: 'MessageEvent',
})

const { selectedElement, updateProperties } = useBpmnContextService()
const messageRef = customRef<string>((track, trigger) => {
  return {
    get() {
      track()
      const messageEventDefinition = getMessageEventDefinition(selectedElement)
      return messageEventDefinition.messageRef?.id
    },
    set(newValue: string) {
      const messageEventDefinition = getMessageEventDefinition(selectedElement)
      const messageRef = findRootElementById(messageEventDefinition, 'bpmn:Message', newValue)
      if (messageRef) {
        updateProperties(
          {
            messageRef: messageRef,
          },
          messageEventDefinition,
        )
      }
      trigger()
    },
  }
})

const messageEventDrawerRef = ref<InstanceType<typeof MessageEventDrawer>>()
const messages = ref<MessageEvent[]>([])
const addMessageEvent = () => {
  messageEventDrawerRef.value?.openDrawer()
}
const confirmMessageEvent = (properties: MessageEvent) => {
  createOrUpdateEventDefinition(properties, 'bpmn:Message')
  loadEvents()
}
const loadEvents = () => {
  const businessObject = getBusinessObject(selectedElement)
  const messageElements = findRootElementsByType(businessObject, 'bpmn:Message')
  messages.value = messageElements.map((item) => {
    return {
      id: item.id,
      name: item.name,
    }
  })
}
onMounted(() => {
  loadEvents()
})
</script>

<template>
  <el-collapse-item name="arg1" title="消息事件">
    <el-form-item prop="messageRef" label="消息引用">
      <el-select v-model="messageRef" placeholder="请选择消息引用">
        <el-option
          v-for="item in messages"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
        <template #footer>
          <el-button
            text
            bg
            size="small"
            style="width: 100%"
            :icon="Plus"
            @click="addMessageEvent()"
            >新增消息定义</el-button
          >
        </template>
      </el-select>
    </el-form-item>
    <MessageEventDrawer ref="messageEventDrawerRef" @confirm="confirmMessageEvent" />
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
