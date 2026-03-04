<script setup lang="ts">
import { useCloned } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import { nextId } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import type { FormProperty } from '@/types'
import { type FormInstance, type FormRules, useFormSize } from 'element-plus'

const emits = defineEmits<{
  (e: 'confirm', data: FormProperty): void
}>()

const formSize = useFormSize()
const drawerVisible = ref(false)
const formRef = ref<FormInstance>()
const { cloned, sync } = useCloned<FormProperty>({
  id: '',
  name: '',
  type: 'string',
  required: false,
  readable: true,
  writable: true,
  expression: '',
  variable: '',
  default: '',
})

const formRules = ref<FormRules>({
  id: [{ required: true, message: '请输入表单属性id', trigger: 'blur' }],
  name: [{ required: true, message: '请输入表单属性名称', trigger: 'blur' }],
  type: [{ required: true, message: '请输入表单属性类型', trigger: 'blur' }],
  expression: [
    {
      validator: (_, value: string) => {
        if (!value) {
          return true
        }
        // Flowable 在解析表达式时依赖 EL 包裹格式，提前阻断可避免保存后运行期报错。
        const expressionPattern = /^(\$\{[^{}]+\}|#\{[^{}]+\})$/
        if (!expressionPattern.test(value.trim())) {
          return new Error('表达式格式错误，请使用 ${...} 或 #{...}')
        }
        return true
      },
      trigger: 'blur',
    },
  ],
})
const typeOptions = [
  { label: '字符串 (string)', value: 'string' },
  { label: '长整型 (long)', value: 'long' },
  { label: '布尔 (boolean)', value: 'boolean' },
  { label: '日期 (date)', value: 'date' },
  { label: '枚举 (enum)', value: 'enum' },
]

const openDrawer = (formProperty?: FormProperty) => {
  if (formProperty) {
    cloned.value = cloneDeep(formProperty)
    cloned.value.element = formProperty.element
  } else {
    sync()
    cloned.value.id = nextId('FormProperty_')
    cloned.value.type = 'string'
    cloned.value.required = false
    cloned.value.readable = true
    cloned.value.writable = true
  }
  drawerVisible.value = true
}

const handleConfirm = () => {
  formRef.value?.validate((valid) => {
    if (!valid) {
      return
    }
    emits('confirm', cloned.value)
    drawerVisible.value = false
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
  <el-dialog
    v-model="drawerVisible"
    append-to-body
    class="form-property-dialog"
    width="min(92vw, 520px)"
    top="8vh"
    :lock-scroll="false"
    destroy-on-close
    @closed="onClosed"
    title="表单属性"
  >
    <el-form
      ref="formRef"
      class="form-property-form"
      label-position="top"
      :model="cloned"
      :rules="formRules"
      :size="formSize || 'default'"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="id" prop="id">
            <el-input v-model="cloned.id" placeholder="请输入表单属性id"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="cloned.name" placeholder="请输入表单属性名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-select v-model="cloned.type" placeholder="请选择类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表达式" prop="expression">
            <el-input v-model="cloned.expression" placeholder="可选"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="变量名" prop="variable">
            <el-input v-model="cloned.variable" placeholder="可选"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认值" prop="default">
            <el-input v-model="cloned.default" placeholder="可选"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :prop="['required', 'readable', 'writable']" label="操作">
            <el-checkbox v-model="cloned.required" label="必填" />
            <el-checkbox v-model="cloned.readable" label="可读" />
            <el-checkbox v-model="cloned.writable" label="可写" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.form-property-dialog .el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.form-property-dialog .el-dialog__header) {
  padding: 14px 16px 10px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.form-property-dialog .el-dialog__body) {
  max-height: 62vh;
  overflow: auto;
  padding: 12px 16px 6px;
}

:deep(.form-property-dialog .el-dialog__footer) {
  padding: 10px 16px 14px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.form-property-form :deep(.el-form-item) {
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .form-property-form :deep(.el-col) {
    max-width: 100%;
    flex: 0 0 100%;
  }
}
</style>
