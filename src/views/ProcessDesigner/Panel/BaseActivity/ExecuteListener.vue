<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ExecutionListener } from '@/types'
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import { useBpmnContextService } from '@/hooks/useService.ts'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import {
  addExtensionElements,
  getExtensionElementsList,
  removeExtensionElements,
} from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'
import ListenerDrawer from '@/views/ProcessDesigner/Panel/BaseActivity/ListenerDrawer.vue'
import type { Element } from 'bpmn-js/lib/model/Types.ts'

const listeners = ref<ExecutionListener[]>([])
const listenerDrawerRef = ref<InstanceType<typeof ListenerDrawer>>()
const { getService, updateProperties, selectedElement } = useBpmnContextService()
const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
const editListener = (listener?: ExecutionListener) => {
  if (listener) {
    const { element } = listener
    if (element) {
      const values: Element[] = element.get('fields')
      listener.fields = values.map((e) => {
        return {
          name: e.name,
          type: e['expression'] ? 'expression' : 'string',
          value: e['expression'] || e['string'],
          element: e,
        }
      })
    }
  }
  listenerDrawerRef.value?.openDrawer(listener)
}
const confirmListener = (listener: ExecutionListener) => {
  const { element, type, impl, event, fields } = listener
  const fieldElements =
    fields?.map((field) => {
      return bpmnFactory?.create('flowable:Field', {
        name: field.name,
        [field.type]: field.value,
      })
    }) || []
  if (element) {
    const listenerProps: Record<string, any> = {
      event: event,
      class: undefined,
      expression: undefined,
      delegateExpression: undefined,
      fields: fieldElements,
    }
    listenerProps[type] = impl
    updateProperties(listenerProps, element)
  } else {
    const listenerElement = bpmnFactory?.create('flowable:ExecutionListener', {
      event: event,
      [type]: impl,
      fields: fieldElements,
    })
    addExtensionElements(selectedElement, listenerElement)
  }
  loadExecutionListeners()
}

const removeListener = (listener: ExecutionListener) => {
  const { element } = listener
  if (bpmnFactory && selectedElement && element) {
    removeExtensionElements(selectedElement, element)
    loadExecutionListeners()
  }
}
const loadExecutionListeners = () => {
  if (selectedElement) {
    const listenerElements = getExtensionElementsList(selectedElement, 'flowable:ExecutionListener')
    listeners.value = listenerElements.map((e) => {
      return {
        event: e.event,
        type: e.class ? 'class' : e.expression ? 'expression' : 'delegateExpression',
        impl: e.class || e.expression || e.delegateExpression,
        element: e,
      }
    })
  }
}
onMounted(() => {
  loadExecutionListeners()
})
</script>

<template>
  <div class="listener-container">
    <div class="listener-header">
      <el-text>执行监听器</el-text>
      <el-button type="primary" link :icon="Plus" @click="editListener()">添加</el-button>
    </div>
    <el-table :data="listeners" height="200px">
      <el-table-column prop="event" label="事件"></el-table-column>
      <el-table-column prop="type" show-overflow-tooltip label="类型"></el-table-column>
      <el-table-column prop="impl" show-overflow-tooltip label="监听"></el-table-column>
      <el-table-column label="操作" min-width="63px" align="center">
        <template #default="{ row }">
          <el-space>
            <el-button type="primary" :icon="EditPen" link @click="editListener(row)"></el-button>
            <el-popconfirm title="您确定要删除该事件吗？" @confirm="removeListener(row)">
              <template #reference>
                <el-button type="danger" :icon="Delete" link></el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <ListenerDrawer ref="listenerDrawerRef" title="执行监听器" @confirm="confirmListener">
      <template #eventOptions>
        <el-radio-button label="开始" value="start" />
        <el-radio-button label="启用" value="enable" />
        <el-radio-button label="结束" value="end" />
      </template>
    </ListenerDrawer>
  </div>
</template>

<style scoped lang="scss">
.listener-container {
  .listener-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 7px 7px;
  }
}
</style>
