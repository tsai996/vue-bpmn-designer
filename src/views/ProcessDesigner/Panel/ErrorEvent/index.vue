<script setup lang="ts">
import {
  findRootElementById,
  findRootElementsByType,
} from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { customRef, onMounted, ref } from 'vue'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import { useBpmnContextService } from '@/hooks/useService.ts'
import type { ErrorEvent } from '@/types'
import {
  createOrUpdateEventDefinition,
  getErrorEventDefinition,
} from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'
import ErrorEventDrawer from '../Process/ErrorEventDrawer.vue'
import { Plus } from '@element-plus/icons-vue'

defineOptions({
  name: 'ErrorEvent',
})

const { selectedElement, updateProperties } = useBpmnContextService()
const errorRef = customRef<string>((track, trigger) => {
  return {
    get() {
      track()
      const errorEventDefinition = getErrorEventDefinition(selectedElement)
      return errorEventDefinition.errorRef?.id
    },
    set(newValue: string) {
      const errorEventDefinition = getErrorEventDefinition(selectedElement)
      const errorRef = findRootElementById(errorEventDefinition, 'bpmn:Error', newValue)
      if (errorRef) {
        updateProperties(
          {
            errorRef: errorRef,
          },
          errorEventDefinition,
        )
      }
      trigger()
    },
  }
})
const errors = ref<ErrorEvent[]>([])
const errorEventDrawerRef = ref<InstanceType<typeof ErrorEventDrawer>>()
const loadEvents = () => {
  const businessObject = getBusinessObject(selectedElement)
  const errorElements = findRootElementsByType(businessObject, 'bpmn:Error')
  errors.value = errorElements.map((item) => {
    return {
      id: item.id,
      name: item.name,
      errorCode: item.errorCode,
    }
  })
}
const addErrorEvent = () => {
  errorEventDrawerRef.value?.openDrawer()
}
const confirmErrorEvent = (properties: ErrorEvent) => {
  createOrUpdateEventDefinition(properties, 'bpmn:Error')
  loadEvents()
}
onMounted(() => {
  loadEvents()
})
</script>

<template>
  <el-collapse-item name="arg1" title="错误事件">
    <el-form-item prop="errorRef" label="错误引用">
      <el-select v-model="errorRef" placeholder="请选择错误引用">
        <el-option
          v-for="item in errors"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
        <template #footer>
          <el-button text bg size="small" style="width: 100%" :icon="Plus" @click="addErrorEvent()"
            >新增错误定义</el-button
          >
        </template>
      </el-select>
    </el-form-item>
    <ErrorEventDrawer ref="errorEventDrawerRef" @confirm="confirmErrorEvent" />
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
