<script setup lang="ts">
import { customRef } from 'vue'
import { useBpmnContextService } from '@/hooks/useService.ts'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'

const { selectedElement, getService, updateProperties } = useBpmnContextService()
const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
const document = customRef((track, trigger) => {
  return {
    get() {
      track()
      const businessObject = getBusinessObject(selectedElement)
      const documentation = findDocumentation(businessObject && businessObject.get('documentation'))
      return (documentation && documentation.text) || ''
    },
    set(newValue: string) {
      const businessObject = getBusinessObject(selectedElement)
      const documentation = findDocumentation(businessObject && businessObject.get('documentation'))
      if (!documentation && newValue && bpmnFactory) {
        const newDocumentation = bpmnFactory.create('bpmn:Documentation', {
          text: newValue,
        })
        updateProperties(
          {
            documentation: [newDocumentation],
          },
          businessObject,
        )
      }
      if (newValue) {
        updateProperties({ text: newValue }, documentation)
      } else {
        updateProperties({ documentation: undefined }, businessObject)
      }
      trigger()
    },
  }
})
const findDocumentation = (docs: Record<string, string>[]) =>
  docs.find((d) => (d.textFormat || 'text/plain') === 'text/plain')
</script>

<template>
  <el-form-item label="描述信息">
    <el-input v-model="document" type="textarea" :rows="3" placeholder="请输入描述信息" />
  </el-form-item>
</template>

<style scoped lang="scss"></style>
