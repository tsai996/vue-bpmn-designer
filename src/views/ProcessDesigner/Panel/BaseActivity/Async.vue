<script setup lang="ts">
import { useCustomRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { customRef } from 'vue'
import { useBpmnContextService } from '@/hooks/useService.ts'
import {
  addExtensionElements,
  getExtensionElement,
  removeExtensionElements,
} from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import { useFormItem } from 'element-plus'

defineOptions({
  name: 'Async',
})

const { form } = useFormItem()
const { selectedElement, updateProperties } = useBpmnContextService()
const asyncBefore = useCustomRef<boolean>('asyncBefore')
const asyncAfter = useCustomRef<boolean>('asyncAfter')
const exclusive = useCustomRef<boolean>('exclusive')
const retryTimeCycle = customRef((track, trigger) => {
  return {
    get() {
      track()
      const failedJobRetryTimeCycle = getExtensionElement(
        selectedElement,
        'flowable:FailedJobRetryTimeCycle',
      )
      return failedJobRetryTimeCycle?.get('body')
    },
    set(newValue: string) {
      const failedJobRetryTimeCycle = getExtensionElement(
        selectedElement,
        'flowable:FailedJobRetryTimeCycle',
      )
      if (newValue) {
        if (!failedJobRetryTimeCycle) {
          const businessObject = getBusinessObject(selectedElement)
          const failedJobRetryTimeCycleElement = businessObject.$model.create(
            'flowable:FailedJobRetryTimeCycle',
            {
              body: newValue,
            },
          )
          addExtensionElements(selectedElement, failedJobRetryTimeCycleElement)
        } else {
          updateProperties({ body: newValue }, failedJobRetryTimeCycle)
        }
      } else {
        failedJobRetryTimeCycle && removeExtensionElements(selectedElement, failedJobRetryTimeCycle)
      }
      trigger()
    },
  }
})
</script>

<template>
  <el-row :gutter="10">
    <el-col :span="form?.labelPosition === 'top' ? 8 : 24">
      <el-form-item label="前异步">
        <el-switch v-model="asyncBefore" />
      </el-form-item>
    </el-col>
    <el-col :span="form?.labelPosition === 'top' ? 8 : 24">
      <el-form-item label="后异步">
        <el-switch v-model="asyncAfter" />
      </el-form-item>
    </el-col>
    <el-col :span="form?.labelPosition === 'top' ? 8 : 24">
      <el-form-item label="排他">
        <el-switch v-model="exclusive" :disabled="!(asyncBefore || asyncAfter)" />
      </el-form-item>
    </el-col>
  </el-row>
  <el-form-item label="失败重试周期" v-show="asyncBefore || asyncAfter">
    <el-input v-model="retryTimeCycle" clearable placeholder="请输入失败重试周期" />
  </el-form-item>
</template>

<style scoped lang="scss"></style>
