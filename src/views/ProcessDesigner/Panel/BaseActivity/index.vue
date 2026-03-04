<script setup lang="ts">
import { useCustomRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import ExecuteListener from './ExecuteListener.vue'
import ExtendedAttribute from './ExtendedProperties.vue'
import { computed, ref } from 'vue'
import { supportsExecutionListener } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'
import { isIdValid } from '@/views/ProcessDesigner/utils/ValidationUtil.ts'
import { ElMessage } from 'element-plus'
import { useBpmnContextService } from '@/hooks/useService.ts'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'

defineOptions({
  name: 'BaseActivity',
})
const { selectedElement } = useBpmnContextService()
const activeTabName = ref('basic')
const actives = ref<string[]>(['general', 'arg1', 'arg2', 'arg3', 'arg4'])
const id = useCustomRef('id')
const isExecutable = useCustomRef('isExecutable')
const name = useCustomRef('name')
const text = useCustomRef('text')
const propertiesByName = computed(() => {
  const businessObject = getBusinessObject(selectedElement)
  return businessObject?.$descriptor?.propertiesByName || {}
})
const updateId = (val: string) => {
  const msg = isIdValid(selectedElement, val)
  if (msg) {
    return ElMessage.warning(msg)
  }
  id.value = val
}
</script>

<template>
  <el-tabs v-model="activeTabName" stretch>
    <el-tab-pane label="基础配置" name="basic">
      <el-scrollbar>
        <el-collapse v-model="actives">
          <el-collapse-item name="general" title="常规">
            <el-form-item label="id">
              <el-input
                :model-value="id"
                @update:model-value="updateId"
                placeholder="请输入节点id"
              />
            </el-form-item>
            <el-form-item label="名称" v-if="propertiesByName['name']">
              <el-input v-model="name" placeholder="请输入节点名称" />
            </el-form-item>
            <el-form-item label="名称" v-else-if="propertiesByName['text']">
              <el-input v-model="text" placeholder="请输入节点名称" />
            </el-form-item>
            <el-form-item label="可执行" v-if="propertiesByName['isExecutable']">
              <el-switch v-model="isExecutable" />
            </el-form-item>
            <slot name="general"></slot>
          </el-collapse-item>
          <slot name="basic"></slot>
        </el-collapse>
      </el-scrollbar>
    </el-tab-pane>
    <slot></slot>
    <el-tab-pane label="其他配置" name="other">
      <el-scrollbar>
        <div class="other-configurations">
          <ExecuteListener v-if="supportsExecutionListener()" />
          <slot name="other"></slot>
          <ExtendedAttribute />
        </div>
      </el-scrollbar>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped lang="scss">
.other-configurations {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

:deep(.el-collapse-item__header) {
  padding-left: 10px;
  box-sizing: border-box;
  position: relative;
  gap: 8px;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    width: 3px;
    height: 15px;
    background-color: var(--el-color-primary);
  }
}

:deep(.el-collapse-item__content) {
  padding: 10px 15px 0 20px;
}
</style>
