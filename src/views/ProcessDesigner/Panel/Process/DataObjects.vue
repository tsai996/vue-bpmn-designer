<script setup lang="ts">
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import type { DataObject } from '@/types'
import type { Element } from 'bpmn-js/lib/model/Types.ts'
import { onMounted, ref } from 'vue'
import DataObjectDrawer from './DataObjectDrawer.vue'
import { removeEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil'
import { useBpmnContextService } from '@/hooks/useService.ts'
import {
  addExtensionElements,
  getExtensionElement,
} from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'

const { updateProperties, selectedElement, getService } = useBpmnContextService()
const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
const dataObjectDrawerRef = ref<InstanceType<typeof DataObjectDrawer>>()
const dataObjects = ref<DataObject[]>([])
const editDataObject = (dataObject?: DataObject) => {
  dataObjectDrawerRef.value?.openDrawer(dataObject)
}
const removeDataObject = (dataObject: DataObject) => {
  removeEventDefinition(dataObject.id, 'bpmn:DataObject')
}
const createDataObject = (dataObject: DataObject) => {
  const properties: Record<string, any> = {
    id: dataObject.id,
    name: dataObject.name,
    'flowable:itemSubjectRef': dataObject.type,
  }
  const dataObjectElement = bpmnFactory?.create('bpmn:DataObject', properties)
  const valueElement = bpmnFactory?.create('flowable:Value', { value: dataObject.value })
  addExtensionElements(dataObjectElement, valueElement)
  return dataObjectElement
}
const confirmDataObject = (dataObject: DataObject) => {
  const businessObject = getBusinessObject(selectedElement)
  const { element } = dataObject
  if (element) {
    const properties: Record<string, any> = {
      id: dataObject.id,
      name: dataObject.name,
      'flowable:itemSubjectRef': dataObject.type,
    }
    const valueElement = bpmnFactory?.create('flowable:Value', { value: dataObject.value })
    const extensionElements = element.get('extensionElements')
    extensionElements.values = [valueElement]
    updateProperties(
      {
        ...properties,
        extensionElements,
      },
      element,
    )
  } else {
    const dataObjectElement = createDataObject(dataObject)
    updateProperties(
      {
        flowElements: [...businessObject.get('flowElements'), dataObjectElement],
      },
      businessObject,
    )
  }
  loadDataObjects()
}
const loadDataObjects = () => {
  const businessObject = getBusinessObject(selectedElement)
  const flowElements = businessObject.get('flowElements') ?? []
  const dataObjectElements: Element[] = flowElements.filter((e: Element) =>
    is(e, 'bpmn:DataObject'),
  )
  dataObjects.value = dataObjectElements.map((item) => {
    const valueElement = getExtensionElement(item, 'flowable:Value')
    return {
      id: item.get('id'),
      name: item.get('name'),
      type: item.get('flowable:itemSubjectRef'),
      value: valueElement?.get('value'),
      element: item,
    }
  })
}
onMounted(() => {
  loadDataObjects()
})
</script>

<template>
  <div class="data-container">
    <div class="data-header">
      <el-text>数据对象</el-text>
      <el-button type="primary" link :icon="Plus" @click="editDataObject()">添加</el-button>
    </div>
    <el-table :data="dataObjects" height="200px">
      <el-table-column prop="name" show-overflow-tooltip label="名称"></el-table-column>
      <el-table-column prop="type" show-overflow-tooltip label="类型"></el-table-column>
      <el-table-column prop="value" show-overflow-tooltip label="默认值"></el-table-column>
      <el-table-column label="操作" min-width="63px" align="center">
        <template #default="{ row }">
          <el-space>
            <el-button type="primary" :icon="EditPen" link @click="editDataObject(row)"></el-button>
            <el-popconfirm title="您确定要删除该数据对象吗？" @confirm="removeDataObject(row)">
              <template #reference>
                <el-button type="danger" :icon="Delete" link></el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <DataObjectDrawer ref="dataObjectDrawerRef" @confirm="confirmDataObject" />
  </div>
</template>

<style scoped lang="scss">
.data-container {
  .data-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 7px 7px;
  }
}
</style>
