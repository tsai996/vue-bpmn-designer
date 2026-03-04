<script setup lang="ts">
import { ref } from 'vue'
import { useCloned } from '@vueuse/core'
import type { Properties } from '@/types'
import { type FormInstance, type FormRules, useFormSize } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { nextId } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { Refresh } from '@element-plus/icons-vue'

const emits = defineEmits<{
  (e: 'confirm', listener: Properties): void
}>()
const formSize = useFormSize()
const drawerVisible = ref(false)
const { cloned, sync } = useCloned<Properties>({
  id: '',
  name: '',
  value: '',
})
const formRef = ref<FormInstance>()
const formRules = ref<FormRules>({
  id: [{ required: true, message: '请输入id', trigger: 'blur' }],
  name: [{ required: true, message: '请输入属性名', trigger: 'blur' }],
  value: [{ required: true, message: '请输入属性值', trigger: 'blur' }],
})

const onClosed = () => {
  sync()
  formRef.value?.clearValidate()
}
const openDrawer = (properties?: Properties) => {
  if (properties) {
    cloned.value = cloneDeep(properties)
    cloned.value.element = properties.element
  } else {
    cloned.value.id = nextId('Property_')
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
    title="扩展属性"
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
      <el-form-item label="id" prop="id">
        <el-input v-model="cloned.id" placeholder="请输入id">
          <template #append>
            <el-button :icon="Refresh" @click="cloned.id = nextId('Property_')" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="属性名" prop="name">
        <el-input v-model="cloned.name" placeholder="请输入属性名"></el-input>
      </el-form-item>
      <el-form-item label="属性值" prop="value">
        <el-input v-model="cloned.value" placeholder="请输入属性值"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss"></style>
