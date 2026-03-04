<script setup lang="ts">
import { customRef } from 'vue'
import type { Element } from 'bpmn-js/lib/model/Types'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import { useBpmnContextService } from '@/hooks/useService.ts'
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import { createElement, isConditionalSource } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import Codemirror from '@/components/CodemirrorEditor/index.vue'
import juelSupport from '@/components/CodemirrorEditor/language/juel'

defineOptions({
  name: 'SequenceFlow',
})
const { updateProperties, selectedElement, getService } = useBpmnContextService()
const modeling = getService<Modeling>('modeling')
const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
const conditionExpression = customRef<string>((track, trigger) => {
  return {
    get() {
      track()
      const businessObject = getBusinessObject(selectedElement)
      if (businessObject.conditionExpression) {
        return businessObject.conditionExpression.body
      }
    },
    set(newValue?: string) {
      if (bpmnFactory && selectedElement) {
        const conditionExpression = createElement(
          'bpmn:FormalExpression',
          bpmnFactory,
          {
            body: newValue,
          },
          selectedElement,
        )
        updateCondition(conditionExpression)
      }
      trigger()
    },
  }
})

const circulationType = customRef<string>((track, trigger) => {
  return {
    get() {
      track()
      if (selectedElement) {
        const businessObject = getBusinessObject(selectedElement)
        if (businessObject.conditionExpression) {
          return 'conditional'
        } else if (isConditionalSource(selectedElement.source)) {
          const business = getBusinessObject(selectedElement.source)
          if (business.default?.id === selectedElement.id) {
            return 'default'
          }
        }
      }
      return 'none'
    },
    set(newValue: string) {
      if (!selectedElement) return
      if (newValue === 'none') {
        setDefaultCondition(selectedElement, false)
        updateCondition(undefined)
      } else if (newValue === 'conditional') {
        if (selectedElement.source.businessObject.default?.id === selectedElement.id) {
          setDefaultCondition(selectedElement, false)
        }
        conditionExpression.value = ``
      } else if (newValue === 'default') {
        setDefaultCondition(selectedElement, true)
        updateCondition(undefined)
      }
      trigger()
    },
  }
})
const setDefaultCondition = (element: Element, isDefault: boolean) => {
  const { source } = element
  if (isConditionalSource(source)) {
    modeling?.updateProperties(source, { default: isDefault ? element : undefined })
  }
}

const updateCondition = (condition?: Element) => {
  updateProperties({
    conditionExpression: condition,
  })
}
</script>

<template>
  <el-collapse-item name="arg1" title="流转条件">
    <el-form-item prop="type" label="流转类型">
      <el-radio-group v-model="circulationType">
        <el-radio-button label="普通" value="none" />
        <el-radio-button label="默认" value="default" />
        <el-radio-button label="条件" value="conditional" />
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="circulationType === 'conditional'" label="条件表达式">
      <Codemirror
        :rows="3"
        :max-rows="6"
        autosize
        no-wrap
        placeholder="请输入条件表达式"
        :extensions="[juelSupport()]"
        v-model="conditionExpression"
      />
      <!--      <el-input
        v-model="conditionExpression"
        placeholder="请输入条件表达式"
        type="textarea"
        :rows="3"
      />-->
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
