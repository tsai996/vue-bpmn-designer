<script setup lang="ts">
import { ref } from 'vue'
import { useCloned } from '@vueuse/core'
import { type FormInstance, type FormRules, useFormSize } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { nextId } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import type { DataObject } from '@/types'
import { Refresh } from '@element-plus/icons-vue'

const emits = defineEmits<{
  (e: 'confirm', data: DataObject): void
}>()
const formSize = useFormSize()
const { cloned, sync } = useCloned<DataObject>({
  id: '',
  name: '',
  type: 'xsd:string',
  value: '',
})
const formRules = ref<FormRules>({
  id: [{ required: true, message: '请输入id', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
})
const formRef = ref<FormInstance>()
const drawerVisible = ref(false)
const openDrawer = (dataObject?: DataObject) => {
  if (dataObject) {
    cloned.value = cloneDeep(dataObject)
    cloned.value.element = dataObject.element
  } else {
    cloned.value.id = nextId('DataObject_')
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
    title="数据对象"
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
            <el-button :icon="Refresh" @click="cloned.id = nextId('DataObject_')" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="cloned.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="cloned.type"
          placeholder="请选择类型"
          @change="cloned.value = undefined"
        >
          <el-option label="字符串" value="xsd:string" />
          <el-option label="整数" value="xsd:int" />
          <el-option label="长整数" value="xsd:long" />
          <el-option label="布尔" value="xsd:boolean" />
          <el-option label="浮点数" value="xsd:double" />
          <el-option label="时间" value="xsd:datetime" />
        </el-select>
      </el-form-item>
      <el-form-item label="默认值" prop="value">
        <el-input
          type="textarea"
          :rows="4"
          :autosize="{ minRows: 4, maxRows: 10 }"
          v-model="cloned.value"
          placeholder="请输入默认值"
          v-if="cloned.type === 'xsd:string'"
        />
        <el-input-number
          v-model="cloned.value"
          placeholder="请输入默认值"
          :min="-2147483648"
          :max="2147483647"
          v-else-if="cloned.type === 'xsd:int'"
          class="w-full"
        />
        <el-input-number
          v-model="cloned.value"
          placeholder="请输入默认值"
          v-else-if="cloned.type === 'xsd:long'"
          class="w-full"
        />
        <el-switch v-model="cloned.value" v-else-if="cloned.type === 'xsd:boolean'" />
        <el-input-number
          v-model="cloned.value"
          placeholder="请输入默认值"
          :min="4.9e-324"
          :max="1.7976931348623157e308"
          v-else-if="cloned.type === 'xsd:double'"
          class="w-full"
        />
        <el-date-picker
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
          v-model="cloned.value"
          placeholder="请选择时间"
          v-else-if="cloned.type === 'xsd:datetime'"
          class="w-full"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss"></style>
