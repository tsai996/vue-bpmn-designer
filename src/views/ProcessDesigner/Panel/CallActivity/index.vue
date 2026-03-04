<script setup lang="ts">
import { createElement, useCustomRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { Delete, EditPen, Plus } from '@element-plus/icons-vue'
import ParamsDrawer, { type Params } from './ParamsDrawer.vue'
import { onMounted, ref, toRaw } from 'vue'
import { useBpmnContextService } from '@/hooks/useService.ts'
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import {
  addExtensionElements,
  getExtensionElementsList,
  removeExtensionElements,
} from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'
import { useFormItem } from 'element-plus'

defineOptions({
  name: 'CallActivity',
})
const { form } = useFormItem()
const { selectedElement, updateProperties, getService } = useBpmnContextService()
const bpmnFactory = getService<BpmnFactory>('bpmnFactory')
const inParamsDrawerRef = ref<InstanceType<typeof ParamsDrawer>>()
const outParamsDrawerRef = ref<InstanceType<typeof ParamsDrawer>>()
const calledElementType = useCustomRef('calledElementType')
const calledElement = useCustomRef('calledElement')
const inheritVariables = useCustomRef('inheritVariables')
const processInstanceName = useCustomRef('processInstanceName')
const idVariableName = useCustomRef('idVariableName')
const businessKey = useCustomRef('businessKey')
const inheritBusinessKey = useCustomRef('inheritBusinessKey')
const sameDeployment = useCustomRef('sameDeployment')
const useLocalScopeForOutParameters = useCustomRef('useLocalScopeForOutParameters')
const inData = ref<Params[]>([])
const outData = ref<Params[]>([])
const editInParams = (row?: Params) => {
  inParamsDrawerRef.value?.openDrawer(row)
}
const editOutParams = (row?: Params) => {
  outParamsDrawerRef.value?.openDrawer(row)
}
const removeParams = (row: Params) => {
  const { element } = row
  if (element) {
    removeExtensionElements(selectedElement, toRaw(element))
    loadParams()
  }
}
const confirmParams = (params: Params, type: 'In' | 'Out') => {
  if (bpmnFactory && selectedElement) {
    const { element } = params
    if (element) {
      updateProperties(
        {
          source: params.source,
          target: params.target,
        },
        toRaw(element),
      )
    } else {
      const inElement = createElement(`flowable:${type}`, bpmnFactory, {
        source: params.source,
        target: params.target,
      })
      addExtensionElements(selectedElement, inElement)
    }
  }
  loadParams()
}
const loadParams = () => {
  if (selectedElement) {
    const inElements = getExtensionElementsList(selectedElement, 'flowable:In')
    const outElements = getExtensionElementsList(selectedElement, 'flowable:Out')
    inData.value = inElements.map((e) => {
      return {
        source: e.source,
        target: e.target,
        element: e,
      }
    })
    outData.value = outElements.map((e) => {
      return {
        source: e.source,
        target: e.target,
        element: e,
      }
    })
  }
}
onMounted(() => {
  loadParams()
})
</script>

<template>
  <el-collapse-item name="arg1" title="调用活动">
    <el-form-item prop="calledElementType" label="活动类型">
      <el-radio-group v-model="calledElementType">
        <el-radio-button label="流程定义Key" value="key" />
        <el-radio-button label="流程定义ID" value="id" />
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="calledElement" label="调用活动">
      <el-input v-model="calledElement" :placeholder="`请输入流程定义${calledElementType}`" />
    </el-form-item>
    <el-form-item prop="processInstanceName" label="流程实例名称">
      <el-input v-model="processInstanceName" placeholder="请输入流程实例名称" />
    </el-form-item>
    <el-form-item prop="idVariableName" label="实例id变量名">
      <el-input v-model="idVariableName" placeholder="请输入实例id变量名" />
    </el-form-item>
    <el-form-item prop="businessKey" label="业务键">
      <el-input v-model="businessKey" placeholder="请输入业务键/表达式" />
    </el-form-item>
    <el-row :gutter="10">
      <el-col :span="form?.labelPosition === 'top' ? 8 : 24">
        <el-form-item prop="inheritBusinessKey" label="继承业务键">
          <el-switch v-model="inheritBusinessKey" :disabled="!!businessKey" />
        </el-form-item>
      </el-col>
      <el-col :span="form?.labelPosition === 'top' ? 8 : 24">
        <el-form-item prop="inheritVariables" label="继承变量">
          <el-switch v-model="inheritVariables" />
        </el-form-item>
      </el-col>
      <el-col :span="form?.labelPosition === 'top' ? 8 : 24">
        <el-form-item prop="sameDeployment" label="相同部署">
          <el-switch v-model="sameDeployment" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item prop="in" label-position="top">
      <template #label>
        入参
        <el-button type="primary" class="el-icon--right" :icon="Plus" @click="editInParams()" link>
          创建入参
        </el-button>
      </template>
      <el-table :data="inData" height="200px">
        <el-table-column prop="source" show-overflow-tooltip label="来源" />
        <el-table-column prop="target" show-overflow-tooltip label="目标" />
        <el-table-column align="center" min-width="60px" label="操作">
          <template #default="{ row }">
            <el-space>
              <el-button type="primary" :icon="EditPen" link @click="editInParams(row)" />
              <el-popconfirm title="您确定要删除该字段吗？" @confirm="removeParams(row)">
                <template #reference>
                  <el-button type="danger" :icon="Delete" link></el-button>
                </template>
              </el-popconfirm>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item prop="out" label-position="top">
      <template #label>
        <div class="flex-space">
          <div>
            出参
            <el-button
              type="primary"
              class="el-icon--right"
              :icon="Plus"
              @click="editOutParams()"
              link
            >
              创建出参
            </el-button>
          </div>
          <el-switch
            v-model="useLocalScopeForOutParameters"
            inline-prompt
            active-text="局部出参"
            inactive-text="全局出参"
          />
        </div>
      </template>
      <el-table :data="outData" height="200px">
        <el-table-column prop="source" show-overflow-tooltip label="来源" />
        <el-table-column prop="target" show-overflow-tooltip label="目标" />
        <el-table-column align="center" min-width="60px" label="操作">
          <template #default="{ row }">
            <el-space>
              <el-button type="primary" :icon="EditPen" link @click="editOutParams(row)" />
              <el-popconfirm title="您确定要删除该字段吗？" @confirm="removeParams(row)">
                <template #reference>
                  <el-button type="danger" :icon="Delete" link></el-button>
                </template>
              </el-popconfirm>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <ParamsDrawer ref="inParamsDrawerRef" title="入参" @confirm="confirmParams($event, 'In')" />
    <ParamsDrawer ref="outParamsDrawerRef" title="出参" @confirm="confirmParams($event, 'Out')" />
  </el-collapse-item>
</template>

<style scoped lang="scss">
:deep(.el-form-item__label) {
  width: 100%;
}
</style>
