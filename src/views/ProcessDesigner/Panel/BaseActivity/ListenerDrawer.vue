<script setup lang="ts">
import { ref } from 'vue'
import { useCloned } from '@vueuse/core'
import type { ExecutionListener } from '@/types'
import {
  ElMessage,
  type FormInstance,
  type FormItemRule,
  type FormRules,
  useFormSize,
} from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { Delete, Plus } from '@element-plus/icons-vue'

const emits = defineEmits<{
  (e: 'confirm', listener: ExecutionListener): void
}>()
const formSize = useFormSize()
const drawerVisible = ref(false)
const { cloned, sync } = useCloned<ExecutionListener>({
  event: '',
  type: 'class',
  impl: '',
  fields: [],
})
const formRef = ref<FormInstance>()
const formRules = ref<FormRules>({
  event: [{ required: true, message: '请选择事件', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
  impl: [
    {
      trigger: 'blur',
      required: true,
      validator(_, value, callback) {
        if (!value) {
          return callback('请输入监听器')
        }
        if (['delegateExpression', 'expression'].includes(cloned.value.type)) {
          const reg = /^\$\{.*\}$/
          if (!reg.test(value)) {
            return callback('请输入正确的表达式，必须是 ${xx} 格式')
          }
        } else if (cloned.value.type === 'class') {
          const reg = /^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)+$/
          if (!reg.test(value)) {
            return callback('请输入正确的java类路径，必须是 com.xx.xx 格式')
          }
        }
        callback()
      },
    },
  ],
})
const fieldNameRule = ref<FormItemRule>({
  trigger: 'blur',
  required: true,
  validator(_, value, callback) {
    if (!value) {
      return callback('字段名不能为空')
    }
    const count = cloned.value.fields?.filter((item) => item.name === value).length || 0
    if (count > 1) {
      ElMessage.warning('字段名不能重复')
      callback(new Error('字段名不能重复'))
    } else {
      callback()
    }
  },
})
const fieldValueRule = ref<FormItemRule>({
  trigger: 'blur',
  required: true,
  validator({ field }, value, callback) {
    if (!value) {
      return callback('字段值不能为空')
    }
    if (field) {
      const index = field.split('.')[1]
      const row = cloned.value.fields?.[parseInt(index)]
      if (row?.type === 'expression') {
        const reg = /^\$\{.*\}$/
        if (!reg.test(value)) {
          return callback('请输入正确的表达式，必须是 ${xx} 格式')
        }
      }
    }
    callback()
  },
})
const onClosed = () => {
  sync()
  formRef.value?.clearValidate()
}
const openDrawer = (listener?: ExecutionListener) => {
  if (listener) {
    cloned.value = cloneDeep(listener)
    cloned.value.element = listener.element
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
const addField = () => {
  cloned.value.fields?.push({
    name: '',
    type: 'string',
    value: '',
  })
}
const delField = (index: number) => {
  cloned.value.fields?.splice(index, 1)
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
      <el-form-item label="事件" prop="event">
        <el-radio-group v-model="cloned.event">
          <slot name="eventOptions"></slot>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="cloned.type">
          <el-radio-button label="java类" value="class" />
          <el-radio-button label="表达式" value="expression" />
          <el-radio-button label="委托表达式" value="delegateExpression" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="监听器" prop="impl">
        <el-input v-model="cloned.impl" placeholder="请输入监听器"></el-input>
      </el-form-item>
      <el-form-item prop="fields">
        <template #label>
          注入字段
          <el-button type="primary" class="el-icon--right" :icon="Plus" link @click="addField()">
            创建字段
          </el-button>
        </template>
        <el-table :data="cloned.fields" height="270px">
          <el-table-column prop="name" label="字段名">
            <template #default="{ row, $index }">
              <el-form-item :prop="`fields.${$index}.name`" :rules="fieldNameRule">
                <el-input v-model="row.name" placeholder="字段名"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="type" min-width="75px" label="字段类型">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`fields.${$index}.type`"
                :rules="{ required: true, message: '字段类型不能为空', trigger: 'change' }"
              >
                <el-select v-model="row.type" placeholder="字段类型">
                  <el-option label="字符串" value="string" />
                  <el-option label="表达式" value="expression" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="字段值">
            <template #default="{ row, $index }">
              <el-form-item :prop="`fields.${$index}.value`" :rules="fieldValueRule">
                <el-input v-model="row.value" placeholder="字段值"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="35px" label="操作">
            <template #default="{ $index }">
              <el-button
                type="danger"
                circle
                :icon="Delete"
                text
                bg
                @click="delField($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss"></style>
