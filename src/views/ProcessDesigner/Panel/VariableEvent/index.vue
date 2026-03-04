<script setup lang="ts">
import { customRef } from 'vue'
import { useBpmnContextService } from '@/hooks/useService.ts'
import { getVariableEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'

defineOptions({
  name: 'VariableEvent',
})
const { selectedElement, updateProperties } = useBpmnContextService()
const useEventRef = <T = string,>(key: string) => {
  return customRef<T>((track, trigger) => {
    return {
      get() {
        track()
        const eventDefinition = getVariableEventDefinition(selectedElement)
        return eventDefinition?.get(key)
      },
      set(newValue: T) {
        const eventDefinition = getVariableEventDefinition(selectedElement)
        if (eventDefinition) {
          updateProperties(
            {
              [key]: newValue,
            },
            eventDefinition,
          )
        }
        trigger()
      },
    }
  })
}
const variableChangeType = useEventRef('variableChangeType')
const variableName = useEventRef('variableName')
</script>

<template>
  <el-collapse-item name="arg1" title="参数监听">
    <el-form-item label="参数事件">
      <el-radio-group v-model="variableChangeType">
        <el-radio-button value="all" label="全部"></el-radio-button>
        <el-radio-button value="create" label="创建"></el-radio-button>
        <el-radio-button value="update" label="更新"></el-radio-button>
        <el-radio-button value="createupdate" label="创建或更新"></el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="参数名称">
      <el-input v-model="variableName" placeholder="请输入参数名"></el-input>
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
