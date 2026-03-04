<script setup lang="ts">
import { ref } from 'vue'
import useCodemirror from '@/components/CodemirrorEditor/useCodemirror.ts'
import { basicSetup } from 'codemirror'
import baseTheme from '@/components/CodemirrorEditor/theme.ts'
import type { Extension } from '@codemirror/state'

const {
  placeholder = '请输入',
  readOnly = false,
  noWrap = false,
  autoWrap = true,
  autofocus = false,
  extensions = [],
} = defineProps<{
  placeholder?: string
  readOnly?: boolean
  noWrap?: boolean
  autoWrap?: boolean
  autofocus?: boolean
  extensions?: Extension[]
}>()
const emits = defineEmits<{
  (e: 'confirm', value: string): void
}>()
const dialogVisible = ref(false)
const codemirrorRef = ref<HTMLDivElement>()
const codeValue = ref()
const { initCodemirror } = useCodemirror(codemirrorRef, codeValue, {
  extensions: [basicSetup, baseTheme, ...extensions],
  autofocus: autofocus,
  onChange(val) {
    codeValue.value = val
  },
  placeholder: placeholder,
  autoWrap: autoWrap,
  noWrap: noWrap,
  readOnly: readOnly,
})
const onOpen = async () => {
  initCodemirror()
}
const onClose = () => {
  codeValue.value = ''
}
const openDialog = (value?: string) => {
  codeValue.value = value
  dialogVisible.value = true
}
const handleConfirm = () => {
  emits('confirm', codeValue.value)
  dialogVisible.value = false
}
defineExpose({
  openDialog,
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    align-center
    draggable
    append-to-body
    destroy-on-close
    @open="onOpen"
    @close="onClose"
    title="编辑器"
  >
    <div class="codemirror-container">
      <div class="codemirror-head">代码：</div>
      <div ref="codemirrorRef" class="codemirror-editor" />
    </div>
    <template #footer>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.codemirror-container {
  border-radius: var(--el-border-radius-base);
}

.codemirror-head {
  border-radius: var(--el-border-radius-base) var(--el-border-radius-base) 0 0;
  background-color: var(--el-color-info-light-9);
  padding: 0 10px;
  height: 32px;
  line-height: 32px;
}

.codemirror-editor {
  width: 100%;
  height: 300px;

  :deep(.cm-editor) {
    padding: 0;
  }
}
</style>
