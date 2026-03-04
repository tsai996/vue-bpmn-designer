<script setup lang="ts">
import { customRef, onMounted, ref, toRaw } from 'vue'
import { useBpmnContextService } from '@/hooks/useService.ts'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import { createElement, useCustomRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import FieldDrawer from './FieldDrawer.vue'
import type { Field, MapException } from '@/types'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import {
  addExtensionElements,
  getExtensionElementsList,
  removeExtensionElements,
} from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'
import MapExceptionDrawer from './MapExceptionDrawer.vue'
import { juelLinter } from '@/components/CodemirrorEditor/language/juel/lint.ts'
import { closeBrackets } from '@codemirror/autocomplete'
import Codemirror from '@/components/CodemirrorEditor/index.vue'

defineOptions({
  name: 'ServiceTask',
})
const { selectedElement, updateProperties, getService } = useBpmnContextService()
const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
const executeType = customRef<string>((track, trigger) => {
  return {
    get() {
      track()
      const businessObject = getBusinessObject(selectedElement)
      return businessObject?.class !== undefined
        ? 'class'
        : businessObject?.expression !== undefined
          ? 'expression'
          : businessObject?.delegateExpression !== undefined
            ? 'delegateExpression'
            : ''
    },
    set(newValue: string) {
      const updatedProperties: Record<string, any> = {
        class: undefined,
        expression: undefined,
        delegateExpression: undefined,
      }
      if (newValue === 'class') {
        updatedProperties.class = ''
      } else if (newValue === 'expression') {
        updatedProperties.expression = ''
      } else if (newValue === 'delegateExpression') {
        updatedProperties.delegateExpression = ''
      }
      updateProperties(updatedProperties)
      trigger()
    },
  }
})
const javaClass = useCustomRef('class')
const expression = useCustomRef('expression')
const delegateExpression = useCustomRef('delegateExpression')
const resultVariableName = useCustomRef<string | undefined>('resultVariableName')
const triggerable = useCustomRef('triggerable')
const injectFields = ref<Field[]>([])
const fieldDrawerRef = ref<InstanceType<typeof FieldDrawer>>()
const mapExceptionDrawerRef = ref<InstanceType<typeof MapExceptionDrawer>>()
const mapExceptionSize = customRef<number>((track, trigger) => {
  return {
    get() {
      track()
      return getExtensionElementsList(selectedElement, 'flowable:MapException').length
    },
    set(newValue: number) {
      trigger()
    },
  }
})
const editField = (field?: Field) => {
  fieldDrawerRef.value?.openDrawer(field)
}
const removeField = (field: Field) => {
  const { element } = field
  if (bpmnFactory && selectedElement && element) {
    removeExtensionElements(selectedElement, toRaw(element))
    loadInjectFields()
  }
}
const confirmField = (field: Field) => {
  if (bpmnFactory && selectedElement) {
    const fieldElements = getExtensionElementsList(selectedElement, 'flowable:Field')
    const element = fieldElements.find((e) => e.name === field.name)
    if (element) {
      updateProperties(
        {
          [field.type]: field.value,
        },
        toRaw(element),
      )
    } else {
      const fieldInjection = createElement('flowable:Field', bpmnFactory, {
        name: field.name,
        [field.type]: field.value,
      })
      addExtensionElements(selectedElement, fieldInjection)
    }
    loadInjectFields()
  }
}
const loadInjectFields = () => {
  if (selectedElement) {
    const fieldInjections = getExtensionElementsList(selectedElement, 'flowable:Field')
    injectFields.value = fieldInjections.map((e) => {
      return {
        name: e.name,
        type: e['expression'] ? 'expression' : 'string',
        value: e['expression'] || e['string'],
        element: e,
      }
    })
  }
}
const changeExecuteType = () => {
  resultVariableName.value = undefined
}
const mapExceptionConfirm = (exceptions: MapException[]) => {
  const exceptionElements = exceptions.map((e) => {
    return bpmnFactory?.create('flowable:MapException', {
      errorCode: e.errorCode,
      exceptionClass: e.exceptionClass,
      includeChildExceptions: e.includeChildExceptions,
    })
  })
  const removes = getExtensionElementsList(selectedElement, 'flowable:MapException')
  removes.length && removeExtensionElements(selectedElement, removes)
  exceptionElements.length && addExtensionElements(selectedElement, exceptionElements)
  mapExceptionSize.value = exceptionElements.length
}
const editException = () => {
  const exceptionElements = getExtensionElementsList(selectedElement, 'flowable:MapException')
  const list = exceptionElements.map((e) => {
    return {
      errorCode: e.get('errorCode'),
      exceptionClass: e.get('exceptionClass'),
      includeChildExceptions: e.get('includeChildExceptions'),
    }
  })
  mapExceptionDrawerRef.value?.openDrawer(list)
}
onMounted(() => {
  loadInjectFields()
})
</script>

<template>
  <el-collapse-item name="arg1" title="服务">
    <el-form-item prop="executeType" label="执行类型">
      <el-radio-group v-model="executeType" @change="changeExecuteType">
        <el-radio-button label="Java类" value="class" />
        <el-radio-button label="表达式" value="expression" />
        <el-radio-button label="委托表达式" value="delegateExpression" />
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="class" label="java类" v-if="executeType === 'class'">
      <Codemirror
        :rows="2"
        :max-rows="6"
        autofocus
        autosize
        no-wrap
        placeholder="请输入java类"
        v-model="javaClass"
      />
      <!--      <el-input v-model="javaClass" type="textarea" :rows="2" placeholder="请输入java类" />-->
    </el-form-item>
    <div v-else-if="executeType === 'expression'">
      <el-form-item prop="expression" label="表达式">
        <Codemirror
          :rows="2"
          :max-rows="6"
          autofocus
          autosize
          no-wrap
          placeholder="请输入表达式"
          :extensions="[juelLinter, closeBrackets()]"
          v-model="expression"
        />
      </el-form-item>
      <!--el-form-item prop="resultVariableName" label="结果变量">
        <el-input v-model="resultVariableName" placeholder="请输入返回结果变量名" />
      </el-form-item>-->
    </div>
    <el-form-item
      prop="delegateExpression"
      label="委托表达式"
      v-else-if="executeType === 'delegateExpression'"
    >
      <Codemirror
        :rows="2"
        :max-rows="6"
        autofocus
        autosize
        no-wrap
        placeholder="请输入委托表达式"
        :extensions="[juelLinter, closeBrackets()]"
        v-model="delegateExpression"
      />
      <!--      <el-input
        v-model="delegateExpression"
        type="textarea"
        :rows="2"
        placeholder="请输入委托表达式"
      />-->
    </el-form-item>
    <el-form-item label-position="top">
      <template #label>
        注入字段
        <el-button type="primary" class="el-icon--right" :icon="Plus" link @click="editField()">
          创建字段
        </el-button>
      </template>
      <el-table :data="injectFields" height="200px">
        <el-table-column prop="name" show-overflow-tooltip label="字段名" />
        <el-table-column prop="type" show-overflow-tooltip label="字段类型" />
        <el-table-column prop="value" show-overflow-tooltip label="字段值" />
        <el-table-column align="center" min-width="66px" label="操作">
          <template #default="{ row }">
            <el-space>
              <el-button type="primary" :icon="EditPen" link @click="editField(row)" />
              <el-popconfirm title="您确定要删除该字段吗？" @confirm="removeField(row)">
                <template #reference>
                  <el-button type="danger" :icon="Delete" link></el-button>
                </template>
              </el-popconfirm>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
      <FieldDrawer ref="fieldDrawerRef" @confirm="confirmField" />
    </el-form-item>
    <el-form-item prop="triggerable" label="可触发" v-show="false">
      <el-switch v-model="triggerable" />
    </el-form-item>
    <el-form-item prop="mapException" label="异常映射">
      <el-badge :show-zero="false" :value="mapExceptionSize" class="w-full">
        <el-button type="info" text bg plain class="w-full" @click="editException"
          >编辑映射
        </el-button>
      </el-badge>
      <MapExceptionDrawer ref="mapExceptionDrawerRef" @confirm="mapExceptionConfirm" />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
