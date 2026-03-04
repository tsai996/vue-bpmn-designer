<script setup lang="ts">
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import type { Properties } from '@/types'
import PropertiesDrawer from './PropertiesDrawer.vue'
import { useBpmnContextService } from '@/hooks/useService.ts'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import { createElement } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import {
  addExtensionElements,
  getExtensionElement,
  removeExtensionElements,
} from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'
import type { Element } from 'bpmn-js/lib/model/Types.ts'

const { selectedElement, updateProperties, getService } = useBpmnContextService()
const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
const propertiesData = ref<Properties[]>([])
const propertiesDrawerRef = ref<InstanceType<typeof PropertiesDrawer>>()
const editAttribute = (properties?: Properties) => {
  propertiesDrawerRef.value?.openDrawer(properties)
}
const removeAttribute = (properties: Properties) => {
  const { element } = properties
  if (element) {
    const properties = getExtensionElement(selectedElement, 'flowable:Properties')
    if (properties) {
      let values: Element[] = properties.get('values') ?? []
      values = values.filter((v) => v !== element)
      updateProperties(
        {
          values: values,
        },
        properties,
      )
      if (!values.length) {
        removeExtensionElements(selectedElement, properties)
      }
    }
  }
  loadProperties()
}
const propertiesConfirm = (properties?: Properties) => {
  if (properties) {
    const { id, name, value, element } = properties
    if (element) {
      updateProperties(
        {
          id: id,
          name: name,
          value: value,
        },
        element,
      )
    } else {
      if (bpmnFactory) {
        let properties = getExtensionElement(selectedElement, 'flowable:Properties')
        if (!properties) {
          properties = createElement('flowable:Properties', bpmnFactory)
          addExtensionElements(selectedElement, properties)
        }
        const property = createElement('flowable:Property', bpmnFactory, {
          id: id,
          name: name,
          value: value,
        })
        updateProperties(
          {
            values: [...(properties?.get('values') ?? []), property],
          },
          properties,
        )
      }
    }
    loadProperties()
  }
}
const loadProperties = () => {
  if (selectedElement) {
    const propertiesElement = getExtensionElement(selectedElement, 'flowable:Properties')
    const values: Element[] = propertiesElement?.get('values') ?? []
    propertiesData.value = values.map((p) => {
      return {
        id: p.get('id'),
        name: p.get('name'),
        value: p.get('value'),
        element: p,
      }
    })
  }
}
onMounted(() => {
  loadProperties()
})
</script>

<template>
  <div class="properties-container">
    <div class="properties-header">
      <el-text>扩展属性</el-text>
      <el-button type="primary" link :icon="Plus" @click="editAttribute()">添加</el-button>
    </div>
    <el-table :data="propertiesData" height="200px">
      <el-table-column prop="name" show-overflow-tooltip label="属性名"></el-table-column>
      <el-table-column prop="value" show-overflow-tooltip label="属性值"></el-table-column>
      <el-table-column label="操作" min-width="60px" align="center">
        <template #default="{ row }">
          <el-space>
            <el-button type="primary" :icon="EditPen" link @click="editAttribute(row)"></el-button>
            <el-popconfirm title="您确定要删除该属性吗？" @confirm="removeAttribute(row)">
              <template #reference>
                <el-button type="danger" :icon="Delete" link></el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <PropertiesDrawer ref="propertiesDrawerRef" @confirm="propertiesConfirm" />
  </div>
</template>

<style scoped lang="scss">
.properties-container {
  .properties-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 7px 7px;
  }
}
</style>
