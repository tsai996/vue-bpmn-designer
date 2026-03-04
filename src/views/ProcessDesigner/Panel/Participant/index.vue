<script setup lang="ts">
import { useBpmnContextService } from '@/hooks/useService.ts'
import { isHorizontal } from 'bpmn-js/lib/util/DiUtil'
import type EventBus from 'diagram-js/lib/core/EventBus'

defineOptions({
  name: 'Participant',
})
const { selectedElement, getService } = useBpmnContextService()
const eventBus = getService<EventBus>('eventBus')
const horizontal = customRef((track, trigger) => {
  return {
    get() {
      track()
      return isHorizontal(selectedElement)
    },
    set(value) {
      selectedElement.di.isHorizontal = value
      eventBus?.fire('elements.changed', { elements: [selectedElement] })
      trigger()
    },
  }
})
</script>

<template>
  <el-collapse-item name="arg1" title="泳道">
    <el-form-item label="方向">
      <el-switch v-model="horizontal" inactive-text="垂直" active-text="水平"></el-switch>
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
