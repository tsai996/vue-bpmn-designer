<script setup lang="ts">
import { customRef } from 'vue'
import { useBpmnContextService } from '@/hooks/useService.ts'
import { getConditionalEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import juelSupport from '@/components/CodemirrorEditor/language/juel'
import Codemirror from '@/components/CodemirrorEditor/index.vue'

defineOptions({
  name: 'ConditionalEvent',
})

const { selectedElement, updateProperties, getService } = useBpmnContextService()
const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
const condition = customRef<string>((track, trigger) => {
  return {
    get() {
      track()
      const conditionalEventDefinition = getConditionalEventDefinition(selectedElement)
      return conditionalEventDefinition.condition?.body
    },
    set(newValue: string) {
      const conditionalEventDefinition = getConditionalEventDefinition(selectedElement)
      const properties: Record<string, any> = {
        condition: undefined,
      }
      if (newValue) {
        const condition = bpmnFactory?.create('bpmn:FormalExpression', {
          body: newValue.trim(),
        })
        properties.condition = condition
        condition.$parent = conditionalEventDefinition
      }
      updateProperties(properties, conditionalEventDefinition)
      trigger()
    },
  }
})
</script>

<template>
  <el-collapse-item name="arg1" title="事件条件">
    <el-form-item prop="condition" label="条件表达式">
      <Codemirror
        :rows="3"
        :max-rows="6"
        autosize
        no-wrap
        placeholder="请输入条件表达式"
        :extensions="[juelSupport()]"
        v-model="condition"
      />
      <!--      <el-input v-model="condition" type="textarea" :rows="4" placeholder="请输入条件表达式" />-->
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
