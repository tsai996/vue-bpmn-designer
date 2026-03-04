<script setup lang="ts">
import {
  findRootElementById,
  findRootElementsByType,
} from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { customRef, onMounted, ref } from 'vue'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import { useBpmnContextService } from '@/hooks/useService.ts'
import type { EscalationEvent } from '@/types'
import {
  createOrUpdateEventDefinition,
  getEscalationEventDefinition,
} from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'
import { Plus } from '@element-plus/icons-vue'
import EscalationEventDrawer from '@/views/ProcessDesigner/Panel/Process/EscalationEventDrawer.vue'

defineOptions({
  name: 'EscalationEvent',
})

const { selectedElement, updateProperties } = useBpmnContextService()
const escalationRef = customRef<string>((track, trigger) => {
  return {
    get() {
      track()
      const escalationEventDefinition = getEscalationEventDefinition(selectedElement)
      return escalationEventDefinition.escalationRef?.id
    },
    set(newValue: string) {
      const escalationEventDefinition = getEscalationEventDefinition(selectedElement)
      const escalationRef = findRootElementById(
        escalationEventDefinition,
        'bpmn:Escalation',
        newValue,
      )
      if (escalationRef) {
        updateProperties(
          {
            escalationRef: escalationRef,
          },
          escalationEventDefinition,
        )
      }
      trigger()
    },
  }
})
const escalationEventDrawerRef = ref<InstanceType<typeof EscalationEventDrawer>>()
const escalations = ref<EscalationEvent[]>([])
const addEscalationEvent = () => {
  escalationEventDrawerRef.value?.openDrawer()
}
const confirmEscalationEvent = (properties: EscalationEvent) => {
  createOrUpdateEventDefinition(properties, 'bpmn:Escalation')
  loadEvents()
}
const loadEvents = () => {
  const businessObject = getBusinessObject(selectedElement)
  const escalationElements = findRootElementsByType(businessObject, 'bpmn:Escalation')
  escalations.value = escalationElements.map((item) => {
    return {
      id: item.id,
      name: item.name,
      escalationCode: item.escalationCode,
    }
  })
}
onMounted(() => {
  loadEvents()
})
</script>

<template>
  <el-collapse-item name="arg1" title="升级事件">
    <el-form-item prop="escalationRef" label="升级引用">
      <el-select v-model="escalationRef" placeholder="请选择升级引用">
        <el-option
          v-for="item in escalations"
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
            @click="addEscalationEvent()"
          >
            新增升级定义
          </el-button>
        </template>
      </el-select>
    </el-form-item>
    <EscalationEventDrawer ref="escalationEventDrawerRef" @confirm="confirmEscalationEvent" />
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
