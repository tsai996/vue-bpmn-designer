<script setup lang="ts">
import { useFieldRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import Codemirror from '@/components/CodemirrorEditor/index.vue'
import juelSupport from '@/components/CodemirrorEditor/language/juel'
import { useBpmnContextService } from '@/hooks/useService.ts'
import { onMounted, ref } from 'vue'
import { filter } from 'min-dash'
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil'
import type { Element } from 'bpmn-js/lib/model/Types'

defineOptions({
  name: 'JumpTask',
})

const { selectedElement } = useBpmnContextService()
const targetNodeId = useFieldRef('targetNodeId')
const conditionExpression = useFieldRef('conditionExpression')
const nodes = ref<Record<string, any>[]>([])
const canJump = (activity: Element) => {
  activity = getBusinessObject(activity)
  return (
    is(activity, 'bpmn:Activity') &&
    selectedElement.id !== activity.id &&
    activity.type !== 'jump' &&
    !activity.triggeredByEvent &&
    !activity.isForCompensation
  )
}

const getJumpActivity = (element: Element): Element[] => {
  const { flowElements } = element
  if (flowElements) {
    return filter(flowElements, canJump)
  }
  return []
}

const findActivityRefs = () => {
  const businessObject = getBusinessObject(selectedElement)
  let parent = businessObject.$parent
  let activities = getJumpActivity(parent)
  if (is(parent, 'bpmn:SubProcess') && parent.triggeredByEvent) {
    parent = parent.$parent
    if (parent) {
      activities = [...activities, ...getJumpActivity(parent)]
    }
  }
  return activities
}
const loadOptions = () => {
  const activities = findActivityRefs()
  nodes.value = activities.map((child: Element) => {
    const businessObject = getBusinessObject(child)
    return {
      label: businessObject.name || businessObject.id,
      value: businessObject.id,
    }
  })
}
onMounted(() => {
  loadOptions()
})
</script>

<template>
  <el-collapse-item name="arg1" title="节点路由">
    <el-form-item label="跳转目标">
      <el-select v-model="targetNodeId" placeholder="请选择跳转目标">
        <el-option
          v-for="node in nodes"
          :key="node.value"
          :label="node.label"
          :value="node.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="条件表达式">
      <Codemirror
        :rows="3"
        :max-rows="6"
        autosize
        no-wrap
        placeholder="请输入条件表达式"
        :extensions="[juelSupport()]"
        v-model="conditionExpression"
      />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
