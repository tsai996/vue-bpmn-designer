<script setup lang="ts">
import { ref } from 'vue'
import { useCloned } from '@vueuse/core'
import { type FormInstance, type FormRules, useFormSize } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import type { Field } from '@/types'

const emits = defineEmits<{
  (e: 'confirm', data: Field): void
}>()
const formSize = useFormSize()
const { cloned, sync } = useCloned<Field>({
  name: '',
  type: 'string',
  value: '',
})
const formRules = ref<FormRules>({
  name: [{ required: true, message: '请输入字段名', trigger: 'blur' }],
  type: [{ required: true, message: '请输入字段类型', trigger: 'blur' }],
  value: [
    { required: true, message: '请输入字段值', trigger: 'blur' },
    {
      validator: (_, value) => {
        if (cloned.value.type === 'expression') {
          const reg = /^\$\{.*\}$/
          if (!reg.test(value)) {
            return new Error('请输入正确的表达式，必须是 ${xx} 格式')
          }
        }
        return true
      },
      trigger: 'blur',
    },
  ],
})
const formRef = ref<FormInstance>()
const drawerVisible = ref(false)
const openDrawer = (field?: Field) => {
  if (field) {
    cloned.value = cloneDeep(field)
    cloned.value.element = field.element
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
const onClosed = () => {
  sync()
  formRef.value?.clearValidate()
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
    @closed="onClosed"
    title="注入字段"
  >
    <el-form
      ref="formRef"
      label-position="top"
      :model="cloned"
      :rules="formRules"
      label-width="90px"
      :size="formSize"
    >
      <el-form-item label="字段名" prop="name">
        <el-input v-model="cloned.name" placeholder="请输入字段名" />
      </el-form-item>
      <el-form-item label="字段类型" prop="type">
        <el-radio-group v-model="cloned.type">
          <el-radio-button value="string" label="字符串" />
          <el-radio-button value="expression" label="表达式" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="字段值" prop="value">
        <el-input v-model="cloned.value" placeholder="请输入字段值" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss"></style>
