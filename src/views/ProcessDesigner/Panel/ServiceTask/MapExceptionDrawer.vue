<script setup lang="ts">
import { ref } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import type { ErrorEvent, MapException } from '@/types'
import { type FormInstance, type FormItemRule, useFormSize } from 'element-plus'
import { useCloned } from '@vueuse/core'
import { isClassValid } from '@/views/ProcessDesigner/utils/ValidationUtil.ts'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import { findRootElementsByType } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { useBpmnContextService } from '@/hooks/useService.ts'
import ErrorEventDrawer from '@/views/ProcessDesigner/Panel/Process/ErrorEventDrawer.vue'
import { createOrUpdateEventDefinition } from '@/views/ProcessDesigner/utils/EventDefinitionUtil.ts'

const emits = defineEmits<{
  (e: 'confirm', exceptions: MapException[]): void
}>()
const { selectedElement } = useBpmnContextService()
const formSize = useFormSize()
const formRef = ref<FormInstance>()
const drawerVisible = ref(false)
const { cloned, sync } = useCloned<{ exceptions: MapException[] }>({
  exceptions: [],
})
const errorEvents = ref<ErrorEvent[]>([])
const errorCodeFormRule = ref<FormItemRule>({
  required: true,
  trigger: 'blur',
  validator(_, value, callback) {
    if (!value) {
      return callback(new Error('请输入错误码'))
    }
    callback()
  },
})
const exceptionClassFormRule = ref<FormItemRule>({
  required: true,
  trigger: 'blur',
  validator(_, value, callback) {
    if (!value) {
      return callback(new Error('请输入异常类'))
    }
    if (!isClassValid(value)) {
      callback(new Error('请输入正确的java类路径，必须是 com.xx.xx 格式'))
    }
    callback()
  },
})
const errorEventDrawerRef = ref<InstanceType<typeof ErrorEventDrawer>>()
const openDrawer = (mapException?: MapException[]) => {
  if (mapException) {
    cloned.value.exceptions = mapException
  }
  loadErrorEvents()
  drawerVisible.value = true
}
const addException = () => {
  cloned.value.exceptions.push({
    errorCode: undefined,
    exceptionClass: undefined,
    includeChildExceptions: false,
  })
}
const handleConfirm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      emits('confirm', cloned.value.exceptions)
      drawerVisible.value = false
    }
  })
}
const onClosed = () => {
  sync()
  formRef.value?.clearValidate()
}
const loadErrorEvents = () => {
  const businessObject = getBusinessObject(selectedElement)
  const errorElements = findRootElementsByType(businessObject, 'bpmn:Error')
  errorEvents.value = errorElements.map((item) => {
    return {
      id: item.id,
      name: item.name,
      errorCode: item.errorCode,
    }
  })
}
const addErrorEvent = () => {
  errorEventDrawerRef.value?.openDrawer()
}
const confirmErrorEvent = (properties: ErrorEvent) => {
  createOrUpdateEventDefinition(properties, 'bpmn:Error')
  loadErrorEvents()
}
defineExpose({
  openDrawer,
})
</script>

<template>
  <el-drawer
    v-model="drawerVisible"
    size="40%"
    append-to-body
    :lock-scroll="false"
    @closed="onClosed"
    title="异常映射"
  >
    <el-form ref="formRef" label-position="top" :model="cloned" :size="formSize">
      <el-form-item>
        <template #label>
          <el-button
            type="primary"
            text
            bg
            class="el-icon--right"
            :icon="Plus"
            @click="addException"
          >
            添加映射
          </el-button>
        </template>
        <el-table :data="cloned.exceptions" height="400px">
          <el-table-column prop="errorCode" label="错误码">
            <template #default="{ row, $index }">
              <el-form-item :prop="`exceptions.${$index}.errorCode`" :rules="errorCodeFormRule">
                <el-select v-model="row.errorCode" placeholder="请选择错误码">
                  <el-option
                    v-for="item in errorEvents.filter(
                      (e) =>
                        !cloned.exceptions.some(
                          (item) =>
                            item.errorCode === e.errorCode && item.errorCode !== row.errorCode,
                        ),
                    )"
                    :key="item.errorCode"
                    :label="item.name"
                    :value="item.errorCode"
                  ></el-option>
                  <template #footer>
                    <el-button
                      text
                      bg
                      size="small"
                      style="width: 100%"
                      :icon="Plus"
                      @click="addErrorEvent()"
                    >
                      新增错误定义
                    </el-button>
                  </template>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="exceptionClass" min-width="120px" label="异常类">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`exceptions.${$index}.exceptionClass`"
                :rules="exceptionClassFormRule"
              >
                <el-input v-model="row.exceptionClass" placeholder="java异常类路径" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="includeChildExceptions"
            min-width="60px"
            label="包含子异常"
          >
            <template #default="{ row }">
              <el-switch v-model="row.includeChildExceptions" />
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="40px" label="操作">
            <template #default="{ $index }">
              <el-button
                type="danger"
                :icon="Delete"
                circle
                text
                bg
                @click="cloned.exceptions.splice($index, 1)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <ErrorEventDrawer ref="errorEventDrawerRef" @confirm="confirmErrorEvent" />
    <template #footer>
      <el-button @click="drawerVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss"></style>
