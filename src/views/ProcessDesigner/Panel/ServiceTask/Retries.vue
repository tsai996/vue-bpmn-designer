<script setup lang="ts">
import { customRef } from 'vue'
import {
  addExtensionElements,
  getExtensionElement,
} from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'
import { useBpmnContextService } from '@/hooks/useService.ts'
import { createElement } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'

const { selectedElement, getService, updateProperties } = useBpmnContextService()
const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
const useCustomRef = (key: string) => {
  return customRef<string>((track, trigger) => {
    return {
      get() {
        track()
        const element = getExtensionElement(selectedElement, 'flowable:FailedJobRetryTimeCycle')
        return element?.get(key)
      },
      set(newValue: string) {
        let element = getExtensionElement(selectedElement, 'flowable:FailedJobRetryTimeCycle')
        if (!element && bpmnFactory) {
          const ele = createElement('flowable:FailedJobRetryTimeCycle', bpmnFactory)
          addExtensionElements(selectedElement, ele)
          element = ele
        }
        if (element) {
          updateProperties(
            {
              [key]: newValue,
            },
            element,
          )
        }
        trigger()
      },
    }
  })
}
const body = useCustomRef('body')
</script>

<template>
  <el-form-item label="失败重试">
    <el-input v-model="body"></el-input>
  </el-form-item>
</template>

<style scoped lang="scss"></style>
