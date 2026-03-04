<script setup lang="ts">
import { customRef, onMounted, ref } from 'vue'
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil'
import { useBpmnContextService } from '@/hooks/useService.ts'
import type { Event } from '@/types'
import type { Element } from 'bpmn-js/lib/model/Types'
import { getCompensateEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'
import { find } from 'min-dash'
import type ElementRegistry from 'diagram-js/lib/core/ElementRegistry'

defineOptions({
  name: 'CompensateEvent',
})

const { selectedElement, updateProperties, getService } = useBpmnContextService()
const elementRegistry = getService<ElementRegistry>('elementRegistry')
const activityRef = customRef<string>((track, trigger) => {
  return {
    get() {
      track()
      const compensateEventDefinition = getCompensateEventDefinition(selectedElement)
      return compensateEventDefinition?.activityRef?.id
    },
    set(newValue: string) {
      const activityRef = newValue ? getBusinessObject(elementRegistry?.get(newValue)) : undefined
      const compensateEventDefinition = getCompensateEventDefinition(selectedElement)
      updateProperties(
        {
          activityRef: activityRef,
        },
        compensateEventDefinition,
      )
      trigger()
    },
  }
})
const waitForCompletion = customRef<boolean>((track, trigger) => {
  return {
    get() {
      track()
      const compensateEventDefinition = getCompensateEventDefinition(selectedElement)
      return compensateEventDefinition?.waitForCompletion
    },
    set(newValue: boolean) {
      const compensateEventDefinition = getCompensateEventDefinition(selectedElement)
      updateProperties(
        {
          waitForCompletion: newValue,
        },
        compensateEventDefinition,
      )
      trigger()
    },
  }
})
const activityOptions = ref<Event[]>([])
const getFlowElements = (element: Element, type: string) => {
  const { flowElements } = element
  return flowElements.filter((flowElement: Element) => is(flowElement, type))
}
const getContainedActivities = (element: Element) => {
  return getFlowElements(element, 'bpmn:Activity')
}
const getContainedBoundaryEvents = (element: Element) => {
  return getFlowElements(element, 'bpmn:BoundaryEvent')
}
const hasCompensationEventAttached = (activity: Element, boundaryEvents: Element[]) => {
  const { id: activityId } = activity
  return !!find(boundaryEvents, (boundaryEvent: Element) => {
    const { attachedToRef } = boundaryEvent
    const compensateEventDefinition = getCompensateEventDefinition(boundaryEvent)
    return attachedToRef && compensateEventDefinition && attachedToRef.id === activityId
  })
}
const canBeCompensated = (activity: Element, boundaryEvents: Element[]) => {
  return (
    is(activity, 'bpmn:CallActivity') ||
    (is(activity, 'bpmn:SubProcess') &&
      !activity.triggeredByEvent &&
      !activity.isForCompensation) ||
    hasCompensationEventAttached(activity, boundaryEvents)
  )
}
const getActivitiesForCompensation = (element: Element) => {
  const activities = getContainedActivities(element)
  const boundaryEvents = getContainedBoundaryEvents(element)
  return activities.filter((activity: Element) => canBeCompensated(activity, boundaryEvents))
}
const findActivityRefs = (element: Element) => {
  const businessObject = getBusinessObject(element)
  let parent = businessObject.$parent
  let activities = getActivitiesForCompensation(parent)
  if (is(parent, 'bpmn:SubProcess') && parent.triggeredByEvent) {
    parent = parent.$parent
    if (parent) {
      activities = [...activities, ...getActivitiesForCompensation(parent)]
    }
  }
  return activities
}
const loadOptions = () => {
  const activities = findActivityRefs(selectedElement)
  activityOptions.value = activities.map((activity: Element) => {
    const { id, name } = activity
    return {
      id,
      name,
    }
  })
}
onMounted(() => {
  loadOptions()
})
</script>

<template>
  <el-collapse-item name="arg1" title="补偿事件">
    <el-form-item prop="activityRef" label="补偿活动">
      <el-select v-model="activityRef" placeholder="请选择补偿活动">
        <el-option
          v-for="item in activityOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="waitForCompletion" label="等待完成">
      <el-switch v-model="waitForCompletion"></el-switch>
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
