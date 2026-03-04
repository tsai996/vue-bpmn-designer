<script setup lang="ts">
import {
  findRootElementById,
  findRootElementsByType,
} from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { customRef, onMounted, ref } from 'vue'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import { useBpmnContextService } from '@/hooks/useService.ts'
import type { SignalEvent } from '@/types'
import {
  createOrUpdateEventDefinition,
  getSignalEventDefinition,
} from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'
import SignalEventDrawer from '@/views/ProcessDesigner/Panel/Process/SignalEventDrawer.vue'
import { Plus } from '@element-plus/icons-vue'

defineOptions({
  name: 'SignalEvent',
})

const { selectedElement, updateProperties } = useBpmnContextService()
const signalRef = customRef<string>((track, trigger) => {
  return {
    get() {
      track()
      const signalEventDefinition = getSignalEventDefinition(selectedElement)
      return signalEventDefinition.signalRef?.id
    },
    set(newValue: string) {
      const signalEventDefinition = getSignalEventDefinition(selectedElement)
      const signalRef = findRootElementById(signalEventDefinition, 'bpmn:Signal', newValue)
      if (signalRef) {
        updateProperties(
          {
            signalRef: signalRef,
          },
          signalEventDefinition,
        )
      }
      trigger()
    },
  }
})
const signals = ref<SignalEvent[]>([])
const signalEventDrawerRef = ref<InstanceType<typeof SignalEventDrawer>>()

const addSignalEvent = () => {
  signalEventDrawerRef.value?.openDrawer()
}
const confirmSignalEvent = (properties: SignalEvent) => {
  createOrUpdateEventDefinition(properties, 'bpmn:Signal')
  loadEvents()
}
const loadEvents = () => {
  const businessObject = getBusinessObject(selectedElement)
  const signalElements = findRootElementsByType(businessObject, 'bpmn:Signal')
  signals.value = signalElements.map((item) => {
    return {
      id: item.get('id'),
      name: item.get('name'),
      'flowable:scope': item.get('flowable:scope'),
    }
  })
}
onMounted(() => {
  loadEvents()
})
</script>

<template>
  <el-collapse-item name="arg1" title="信号事件">
    <el-form-item prop="signalRef" label="信号引用">
      <el-select v-model="signalRef" placeholder="请选择信号引用">
        <el-option
          v-for="item in signals"
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
            @click="addSignalEvent()"
          >
            新增信号定义
          </el-button>
        </template>
      </el-select>
      <SignalEventDrawer ref="signalEventDrawerRef" @confirm="confirmSignalEvent" />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
