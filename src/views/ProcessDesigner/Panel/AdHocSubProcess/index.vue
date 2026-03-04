<script setup lang="ts">
import { useCustomRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { customRef } from 'vue'
import { useBpmnContextService } from '@/hooks/useService.ts'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import type { Moddle } from 'bpmn-js/lib/model/Types.ts'
import juelSupport from '@/components/CodemirrorEditor/language/juel'
import Codemirror from '@/components/CodemirrorEditor/index.vue'

defineOptions({
  name: 'AdHocSubProcess',
})
const { selectedElement, getService } = useBpmnContextService()
const moddle = getService<Moddle>('moddle')
const ordering = useCustomRef('ordering')
const cancelRemainingInstances = useCustomRef('cancelRemainingInstances')
const completionCondition = customRef((track, trigger) => {
  return {
    get() {
      track()
      const businessObject = getBusinessObject(selectedElement)
      return businessObject.get('completionCondition')?.body
    },
    set(newValue: string) {
      const businessObject = getBusinessObject(selectedElement)
      const completionCondition = businessObject.get('completionCondition')
      if (completionCondition) {
        completionCondition.set('body', newValue)
      } else {
        businessObject.set(
          'completionCondition',
          moddle.create('bpmn:FormalExpression', {
            body: newValue,
          }),
        )
      }
      trigger()
    },
  }
})
</script>

<template>
  <el-collapse-item name="arg1" title="临时子流程">
    <el-form-item label="排序">
      <el-radio-group v-model="ordering">
        <el-radio-button label="并行" value="Parallel" />
        <el-radio-button label="串行" value="Sequential" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="取消剩余实例">
      <el-switch v-model="cancelRemainingInstances" active-value="true" inactive-value="false" />
    </el-form-item>
    <el-form-item label="完成条件">
      <Codemirror
        :rows="3"
        :max-rows="6"
        autosize
        no-wrap
        placeholder="请输入完成条件"
        :extensions="[juelSupport()]"
        v-model="completionCondition"
      />
      <!--      <el-input
        v-model="completionCondition"
        type="textarea"
        :rows="3"
        placeholder="请输入完成条件"
      />-->
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
