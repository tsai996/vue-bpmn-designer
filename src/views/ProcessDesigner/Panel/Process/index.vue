<script setup lang="ts">
import { useCustomRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { customRef } from 'vue'
import {
  addExtensionElements,
  getExtensionElement,
  removeExtensionElements,
} from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'
import { useBpmnContextService } from '@/hooks/useService.ts'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'

defineOptions({
  name: 'Process',
})
const { selectedElement, updateProperties } = useBpmnContextService()
const candidateStarterGroups = useCustomRef<string[]>('candidateStarterGroups')
const candidateStarterUsers = useCustomRef<string[]>('candidateStarterUsers')
const historyLevel = customRef((track, trigger) => {
  return {
    get() {
      track()
      const historyLevel = getExtensionElement(selectedElement, 'flowable:HistoryLevel')
      return historyLevel?.get('body')
    },
    set(newValue: string) {
      let historyLevel = getExtensionElement(selectedElement, 'flowable:HistoryLevel')
      if (newValue) {
        if (historyLevel) {
          updateProperties({ body: newValue }, historyLevel)
        } else {
          const businessObject = getBusinessObject(selectedElement)
          historyLevel = businessObject.$model.create('flowable:HistoryLevel', {
            body: newValue,
          })
          historyLevel && addExtensionElements(selectedElement, historyLevel)
        }
      } else {
        historyLevel && removeExtensionElements(selectedElement, historyLevel)
      }
      trigger()
    },
  }
})
</script>

<template>
  <el-collapse-item name="arg1" :title="$tu('流程')">
    <el-form-item :label="$tu('流程启动人')">
      <el-select v-model="candidateStarterGroups" multiple :placeholder="$tu('请选择启动人')">
        <el-option :label="$tu('张三')" value="zhangsan" />
        <el-option :label="$tu('李四')" value="lisi" />
        <el-option :label="$tu('王五')" value="wangwu" />
        <el-option :label="$tu('毛六')" value="maoliu" />
        <el-option :label="$tu('钱七')" value="qianqi" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$tu('流程启动角色')">
      <el-select v-model="candidateStarterUsers" multiple :placeholder="$tu('请选择启动角色')">
        <el-option :label="$tu('项目经理')" value="zhangsan" />
        <el-option :label="$tu('产品经理')" value="lisi" />
        <el-option :label="$tu('技术总监')" value="wangwu" />
        <el-option :label="$tu('架构师')" value="maoliu" />
        <el-option :label="$tu('开发主管')" value="qianqi" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$tu('历史级别')">
      <el-select v-model="historyLevel" clearable :placeholder="$tu('请选择历史级别')">
        <el-option :label="$tu('🚫 不记录（性能最佳）')" value="none"></el-option>
        <el-option :label="$tu('🟢 仅流程实例（记录启动/结束）')" value="instance"></el-option>
        <el-option :label="$tu('📝 任务级别（记录处理人、任务状态）')" value="task"></el-option>
        <el-option :label="$tu('📌 节点活动（记录每一步执行）')" value="activity"></el-option>
        <el-option :label="$tu('🔍 审计跟踪（流程+任务+节点+变量）')" value="audit"></el-option>
        <el-option :label="$tu('📚 全部细节（最完整记录）')" value="full"></el-option>
      </el-select>
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
