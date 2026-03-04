<script setup lang="ts">
import { customRef } from 'vue'
import { useBpmnContextService } from '@/hooks/useService.ts'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import { getTimerEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'

defineOptions({
  name: 'TimerEvent',
})
const { getService, updateProperties, selectedElement } = useBpmnContextService()
const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
const type = customRef<string>((track, trigger) => {
  return {
    get() {
      track()
      const timerEventDefinition = getTimerEventDefinition(selectedElement)
      return timerEventDefinition?.timeDuration !== undefined
        ? 'timeDuration'
        : timerEventDefinition?.timeCycle !== undefined
          ? 'timeCycle'
          : timerEventDefinition?.timeDate !== undefined
            ? 'timeDate'
            : ''
    },
    set(newValue: string) {
      const timerEventDefinition = getTimerEventDefinition(selectedElement)
      const properties: Record<string, any> = {
        timeDate: undefined,
        timeDuration: undefined,
        timeCycle: undefined,
      }
      const formalExpression = bpmnFactory?.create('bpmn:FormalExpression', {
        body: '',
      })
      formalExpression.$parent = timerEventDefinition
      if (newValue === 'timeDate') {
        properties.timeDate = formalExpression
      } else if (newValue === 'timeDuration') {
        properties.timeDuration = formalExpression
      } else if (newValue === 'timeCycle') {
        properties.timeCycle = formalExpression
      }
      updateProperties(properties, timerEventDefinition)
      trigger()
    },
  }
})
const time = customRef<string>((track, trigger) => {
  return {
    get() {
      track()
      const timerEventDefinition = getTimerEventDefinition(selectedElement)
      return timerEventDefinition.get(type.value)?.body
    },
    set(newValue: string) {
      const timerEventDefinition = getTimerEventDefinition(selectedElement)
      const formalExpression = timerEventDefinition.get(type.value)
      if (formalExpression) {
        formalExpression.body = newValue
        updateProperties(
          {
            [type.value]: formalExpression,
          },
          timerEventDefinition,
        )
        trigger()
      }
    },
  }
})
</script>

<template>
  <el-collapse-item name="arg1" title="定时">
    <el-form-item label="类型">
      <el-radio-group v-model="type" placeholder="请选择时间类型">
        <el-radio-button label="时间" value="timeDate" />
        <el-radio-button label="持续" value="timeDuration" />
        <el-radio-button label="循环" value="timeCycle" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="等待时间" v-if="type === 'timeDate'">
      <el-date-picker
        v-model="time"
        type="datetime"
        value-format="YYYY-MM-DDTHH:mm:ss"
        placeholder="请输入等待时间"
        class="w-full"
      />
    </el-form-item>
    <el-form-item label="持续时间" v-else-if="type === 'timeDuration'">
      <el-input v-model="time" placeholder="请输入持续时间" />
    </el-form-item>
    <el-form-item label="循环时间" v-else-if="type === 'timeCycle'">
      <el-input v-model="time" placeholder="请输入循环时间" />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
