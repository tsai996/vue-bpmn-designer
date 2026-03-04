<script setup lang="ts">
import { ref } from 'vue'
import { useCloned } from '@vueuse/core'
import { type FormInstance, type FormRules, useFormSize } from 'element-plus'
import { cloneDeep } from 'lodash-es'

export interface Params {
  source: string
  target: string
  element?: any
}

const emits = defineEmits<{
  (e: 'confirm', data: Params): void
}>()
const formSize = useFormSize()
const { cloned, sync } = useCloned<Params>({
  source: '',
  target: '',
})
const formRules = ref<FormRules>({
  source: [{ required: true, message: '请输入来源', trigger: 'blur' }],
  target: [{ required: true, message: '请输入目标', trigger: 'blur' }],
})
const formRef = ref<FormInstance>()
const drawerVisible = ref(false)
const openDrawer = (field?: Params) => {
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
    v-bind="$attrs"
    title="出入参数"
  >
    <el-form
      ref="formRef"
      label-position="top"
      :model="cloned"
      :rules="formRules"
      label-width="90px"
      :size="formSize"
    >
      <el-form-item label="来源" prop="source">
        <el-input v-model="cloned.source" placeholder="请输入来源" />
      </el-form-item>
      <el-form-item label="目标" prop="target">
        <el-input v-model="cloned.target" placeholder="请输入目标" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss"></style>
