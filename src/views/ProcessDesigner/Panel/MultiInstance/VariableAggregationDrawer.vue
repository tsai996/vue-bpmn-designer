<script setup lang="ts">
import { ref } from 'vue'
import { useCloned } from '@vueuse/core'
import type { VariableAggregation } from '@/types'
import { type FormInstance, type FormItemRule, type FormRules, useFormSize } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { Delete, Plus } from '@element-plus/icons-vue'

const emits = defineEmits<{
  (e: 'confirm', variableAggregation: VariableAggregation): void
}>()
const formSize = useFormSize()
const drawerVisible = ref(false)
const { cloned, sync } = useCloned<VariableAggregation>({
  target: '',
  variableType: 'createOverviewVariable',
  expression: '',
  variables: [],
})
const formRef = ref<FormInstance>()
const expressionRule = ref<FormItemRule>({
  trigger: 'blur',
  validator: (_, value, callback) => {
    if (value) {
      const match = value.match(/^\$\{(.+)\}$/)
      value = match?.length ? match[1] : value
      if (!/^([a-z][\w-.]*:)?[a-z_][\w-.]*$/i.test(value)) {
        return callback(
          new Error(translateUi('变量名只能包含字母、数字、下划线，且不能以数字开头')),
        )
      }
    }
    callback()
  },
})
const formRules = computed<FormRules>(() => ({
  target: [
    expressionRule.value,
    { required: true, message: translateUi('请输入目标'), trigger: 'blur' },
  ],
  expression: [
    {
      validator: (_, value, callback) => {
        if (value) {
          if (!/^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)+$/.test(value) && !/^\$\{.*\}$/.test(value)) {
            return callback(new Error(translateUi('请输入正确的java类路径/委托表达式')))
          }
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
  variableType: [{ required: true, message: translateUi('请选择变量类型'), trigger: 'change' }],
  variables: [
    { required: true, message: translateUi('请选择添加变量'), trigger: 'change', type: 'array' },
  ],
}))

const onClosed = () => {
  sync()
  formRef.value?.clearValidate()
}
const openDrawer = (variableAggregation?: VariableAggregation) => {
  if (variableAggregation) {
    cloned.value = cloneDeep(variableAggregation)
    cloned.value.element = variableAggregation.element
  }
  drawerVisible.value = true
}
const handleConfirm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      emits('confirm', cloned.value)
      drawerVisible.value = false
    }
  })
}
const addVariable = () => {
  cloned.value.variables.push({
    source: '',
    target: '',
  })
}
const delVariable = (index: number) => {
  cloned.value.variables?.splice(index, 1)
}
defineExpose({
  openDrawer,
})
</script>

<template>
  <el-drawer
    v-model="drawerVisible"
    append-to-body
    :lock-scroll="false"
    size="35%"
    @closed="onClosed"
    :title="$tu('变量聚合')"
    v-bind="$attrs"
  >
    <el-form
      ref="formRef"
      label-position="top"
      :model="cloned"
      :rules="formRules"
      label-width="90px"
      :size="formSize"
    >
      <el-form-item :label="$tu('聚合变量')" prop="target">
        <el-input v-model="cloned.target" :placeholder="$tu('请输入变量名/委托表达式')"></el-input>
      </el-form-item>
      <el-form-item :label="$tu('自定义实现')" prop="expression">
        <el-input
          v-model="cloned.expression"
          :placeholder="$tu('请输入java类/委托表达式')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$tu('变量类型')" prop="variableType">
        <el-radio-group v-model="cloned.variableType">
          <el-radio-button :label="$tu('普通变量')" value="createOverviewVariable" />
          <el-radio-button :label="$tu('瞬态变量')" value="storeAsTransientVariable" />
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$tu('变量定义')" prop="variables">
        <template #label>
          {{ $tu('变量定义') }}
          <el-button type="primary" :icon="Plus" link @click="addVariable">
            {{ $tu('添加变量') }}</el-button
          >
        </template>
        <el-table :data="cloned.variables" height="250px">
          <el-table-column prop="source" :label="$tu('源变量')">
            <template #default="{ row, $index }">
              <el-form-item :prop="`variables.${$index}.source`" required :rules="expressionRule">
                <el-input v-model="row.source" :placeholder="$tu('源变量')"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="target" :label="$tu('目标变量')">
            <template #default="{ row, $index }">
              <el-form-item :prop="`variables.${$index}.target`" required :rules="expressionRule">
                <el-input v-model="row.target" :placeholder="$tu('目标变量')"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="45px" :label="$t('ui.operation')">
            <template #default="{ $index }">
              <el-button
                type="danger"
                circle
                :icon="Delete"
                text
                bg
                @click="delVariable($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">{{ $t('ui.cancel') }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ $t('ui.confirm') }}</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss"></style>
