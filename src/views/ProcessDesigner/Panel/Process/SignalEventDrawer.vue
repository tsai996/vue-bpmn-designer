<script setup lang="ts">
import { ref } from 'vue'
import { useCloned } from '@vueuse/core'
import { type FormInstance, type FormRules, useFormSize } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { nextId } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import type { SignalEvent } from '@/types'
import { Refresh } from '@element-plus/icons-vue'

const emits = defineEmits<{
  (e: 'confirm', data: SignalEvent): void
}>()
const formSize = useFormSize()
const { cloned, sync } = useCloned<SignalEvent>({
  id: '',
  name: '',
  'flowable:scope': 'global',
})
const formRules = ref<FormRules>({
  id: [{ required: true, message: '请输入id', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  'flowable:scope': [{ required: true, message: '请输入作用域', trigger: 'blur' }],
})
const formRef = ref<FormInstance>()
const drawerVisible = ref(false)
const openDrawer = (signal?: SignalEvent) => {
  if (signal) {
    cloned.value = cloneDeep(signal)
    cloned.value.element = signal.element
  } else {
    cloned.value.id = nextId('Signal_')
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
    title="信号事件"
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
            <el-button :icon="Refresh" @click="cloned.id = nextId('Signal_')" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="cloned.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="作用域" prop="flowable:scope">
        <el-radio-group v-model="cloned['flowable:scope']">
          <el-radio-button label="global">全局</el-radio-button>
          <el-radio-button label="processInstance">当前实例</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss"></style>
