<script setup lang="ts">
import { customRef, onMounted, ref, toRaw } from 'vue'
import { useBpmnContextService } from '@/hooks/useService.ts'
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import VariableAggregationDrawer from './VariableAggregationDrawer.vue'
import { getLoopCharacteristics } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import type { VariableAggregation } from '@/types'
import { isDelegateExpression } from '@/views/ProcessDesigner/utils'
import {
  addExtensionElements,
  getExtensionElement,
  getExtensionElementsList,
  removeExtensionElements,
} from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import type { Element } from 'bpmn-js/lib/model/Types.ts'
import { useFormItem } from 'element-plus'
import type EventBus from 'diagram-js/lib/core/EventBus'
import juelSupport from '@/components/CodemirrorEditor/language/juel'
import Codemirror from '@/components/CodemirrorEditor/index.vue'
import { isExpressionValid } from '@/views/ProcessDesigner/utils/ValidationUtil.ts'

defineOptions({
  name: 'MultiInstance',
})
const { form } = useFormItem()
const { updateProperties, getService, selectedElement } = useBpmnContextService()
const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
const eventBus = getService<EventBus>('eventBus')
const useCustomRef = (key: string, expression?: boolean) => {
  return customRef<string>((track, trigger) => {
    return {
      get() {
        track()
        const loopCharacteristics = getLoopCharacteristics(selectedElement)
        if (expression) {
          return loopCharacteristics?.get(key)?.body
        }
        return loopCharacteristics?.get(key)
      },
      set(newValue: string) {
        if (expression && newValue) {
          newValue = bpmnFactory?.create('bpmn:FormalExpression', {
            body: newValue.toString(),
          })
        }
        const loopCharacteristics = getLoopCharacteristics(selectedElement)
        updateProperties({ [key]: newValue ? newValue : undefined }, loopCharacteristics)
        trigger()
      },
    }
  })
}
const loopCharacteristicsType = customRef<string>((track, trigger) => {
  return {
    get() {
      track()
      const loopCharacteristics = getLoopCharacteristics(selectedElement)
      if (loopCharacteristics) {
        return loopCharacteristics.isSequential ? 'Sequential' : 'Parallel'
      }
      return ''
    },
    set(newValue: string) {
      if (newValue) {
        const multiLoopInstance = bpmnFactory?.create('bpmn:MultiInstanceLoopCharacteristics', {
          isSequential: newValue === 'Sequential',
          collection: '',
          elementVariable: '',
        })
        updateProperties({ loopCharacteristics: multiLoopInstance })
      } else {
        updateProperties({ loopCharacteristics: undefined })
      }
      trigger()
    },
  }
})
const noWaitStatesAsyncLeave = useCustomRef('noWaitStatesAsyncLeave')
const loopCardinality = useCustomRef('loopCardinality', true)
const completionCondition = useCustomRef('completionCondition', true)
const collection = useCustomRef('collection')
const elementVariable = useCustomRef('elementVariable')
const elementIndexVariable = useCustomRef('elementIndexVariable')
const variableAggregationDrawerRef = ref<InstanceType<typeof VariableAggregationDrawer>>()
const variableAggregations = ref<VariableAggregation[]>([])
const collectionHandler = customRef<string>((track, trigger) => {
  return {
    get() {
      track()
      const loopCharacteristics = getLoopCharacteristics(selectedElement)
      const collectionElement = getExtensionElement(loopCharacteristics, 'flowable:Collection')
      if (collectionElement) {
        return collectionElement.get('class') || collectionElement.get('delegateExpression')
      }
    },
    set(newValue: string) {
      const loopCharacteristics = getLoopCharacteristics(selectedElement)
      let collectionElement = getExtensionElement(loopCharacteristics, 'flowable:Collection')
      if (!collectionElement) {
        collectionElement = bpmnFactory?.create('flowable:Collection', {
          class: undefined,
          delegateExpression: undefined,
        })
        if (collectionElement) {
          addExtensionElements(loopCharacteristics, collectionElement)
        }
      }
      const properties: Record<string, any> = {
        class: undefined,
        delegateExpression: undefined,
      }
      if (isExpressionValid(newValue)) {
        properties.delegateExpression = newValue
      } else {
        properties.class = newValue
      }
      updateProperties(properties, collectionElement)
      trigger()
    },
  }
})
const juelExtension = juelSupport({
  completions: [
    {
      label: 'nrOfInstances',
      type: 'variable',
      detail: '多实例：总数',
    },
    {
      label: 'nrOfCompletedInstances',
      type: 'variable',
      detail: '多实例：已完成数',
    },
    {
      label: 'nrOfActiveInstances',
      type: 'variable',
      detail: '多实例：进行中数',
    },
    {
      label: 'loopCounter',
      type: 'variable',
      detail: '多实例：索引',
    },
  ],
})
const addVariableAggregation = (row?: VariableAggregation) => {
  variableAggregationDrawerRef.value?.openDrawer(row)
}
const removeVariableAggregation = (row: VariableAggregation) => {
  const { element } = row
  if (element) {
    removeExtensionElements(selectedElement, toRaw(element))
  }
  loadVariableAggregations()
}
const confirmVariableAggregation = (variableAggregation: VariableAggregation) => {
  const loopCharacteristics = getLoopCharacteristics(selectedElement)
  const { target, expression, variableType, variables } = variableAggregation
  const properties: Record<string, any> = {
    target: undefined,
    targetExpression: undefined,
    createOverviewVariable: undefined,
    storeAsTransientVariable: undefined,
    class: undefined,
    delegateExpression: undefined,
    values: undefined,
  }
  properties[variableType] = true
  if (isDelegateExpression(target)) {
    properties.targetExpression = target
  } else {
    properties.target = target
  }
  if (isDelegateExpression(expression)) {
    properties.delegateExpression = expression
  } else {
    properties.class = expression
  }
  properties.values = variables.map((variable) => {
    const { source, target } = variable
    const properties: Record<string, any> = {
      source: undefined,
      sourceExpression: undefined,
      target: undefined,
      targetExpression: undefined,
    }
    if (isDelegateExpression(source)) {
      properties.sourceExpression = source
    } else {
      properties.source = source
    }
    if (isDelegateExpression(target)) {
      properties.targetExpression = target
    } else {
      properties.target = target
    }
    return bpmnFactory?.create('flowable:Variable', properties)
  })
  const { element } = variableAggregation
  if (element) {
    updateProperties(properties, element)
  } else {
    const aggregation = bpmnFactory?.create('flowable:VariableAggregation', properties)
    aggregation && addExtensionElements(loopCharacteristics, aggregation)
  }
  loadVariableAggregations()
}
const loadVariableAggregations = () => {
  const loopCharacteristics = getLoopCharacteristics(selectedElement)
  if (loopCharacteristics) {
    const values = getExtensionElementsList(loopCharacteristics, 'flowable:VariableAggregation')
    variableAggregations.value = values.map((aggregation) => {
      return {
        target: aggregation.target || aggregation.targetExpression,
        expression: aggregation.class || aggregation.delegateExpression,
        variableType: aggregation.createOverviewVariable
          ? 'createOverviewVariable'
          : 'storeAsTransientVariable',
        variables: aggregation.values.map((variable: Element) => {
          return {
            source: variable.source || variable.sourceExpression,
            target: variable.target || variable.targetExpression,
          }
        }),
        element: aggregation,
      }
    })
  }
}
const changeElementVariable = (val: string) => {
  if (val) {
    eventBus?.fire('elementVariableChanged', {
      element: selectedElement,
      elementVariable: val,
    })
  }
}
onMounted(() => {
  loadVariableAggregations()
})
</script>

<template>
  <div>
    <el-form-item label="实例类型">
      <el-radio-group v-model="loopCharacteristicsType">
        <el-radio-button label="无" value="" />
        <el-radio-button label="并行" value="Parallel" />
        <el-radio-button label="串行" value="Sequential" />
      </el-radio-group>
    </el-form-item>
    <div v-if="loopCharacteristicsType">
      <el-form-item label="基数">
        <el-input v-model="loopCardinality" placeholder="请输入基数" />
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="form?.labelPosition === 'top' ? 12 : 24">
          <el-form-item label="集合变量">
            <el-input v-model="collection" placeholder="请输入集合变量" />
          </el-form-item>
        </el-col>
        <el-col :span="form?.labelPosition === 'top' ? 12 : 24">
          <el-form-item label="元素变量">
            <el-input
              v-model="elementVariable"
              @change="changeElementVariable"
              placeholder="请输入元素变量"
            />
          </el-form-item>
        </el-col>
        <el-col :span="form?.labelPosition === 'top' ? 12 : 24" v-show="false">
          <el-form-item label="索引变量">
            <el-input v-model="elementIndexVariable" placeholder="请输入索引变量" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="无等待离开" v-show="loopCharacteristicsType === 'Parallel' && false">
        <el-switch
          v-model="noWaitStatesAsyncLeave"
          :active-value="true"
          :inactive-value="undefined"
        />
      </el-form-item>
      <el-form-item label="集合处理器" v-show="false">
        <el-input v-model="collectionHandler" placeholder="请输入集合处理器" />
      </el-form-item>
      <el-form-item label="完成条件">
        <Codemirror
          autosize
          :max-rows="5"
          no-wrap
          placeholder="请输入完成条件"
          :extensions="[juelExtension]"
          v-model="completionCondition"
        />
        <!--        <el-input v-model="completionCondition" placeholder="请输入完成条件" />-->
      </el-form-item>
      <el-form-item label-position="top">
        <template #label>
          变量聚合
          <el-button type="primary" :icon="Plus" link @click="addVariableAggregation()">
            添加聚合
          </el-button>
        </template>
        <el-table :data="variableAggregations" height="150px">
          <el-table-column prop="target" label="聚合变量" />
          <el-table-column prop="variableType" label="变量类型">
            <template #default="{ row }">
              {{ row.variableType === 'createOverviewVariable' ? '普通变量' : '瞬态变量' }}
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="50px" label="操作">
            <template #default="{ row }">
              <el-space>
                <el-button
                  type="primary"
                  :icon="EditPen"
                  link
                  @click="addVariableAggregation(row)"
                />
                <el-popconfirm
                  title="您确定要删除该字段吗？"
                  @confirm="removeVariableAggregation(row)"
                >
                  <template #reference>
                    <el-button type="danger" :icon="Delete" link></el-button>
                  </template>
                </el-popconfirm>
              </el-space>
            </template>
          </el-table-column>
        </el-table>
        <VariableAggregationDrawer
          ref="variableAggregationDrawerRef"
          @confirm="confirmVariableAggregation"
        />
      </el-form-item>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
