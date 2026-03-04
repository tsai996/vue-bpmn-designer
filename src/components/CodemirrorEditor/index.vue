<script setup lang="ts">
import useCodemirror, {
  type CodemirrorOptions,
} from '@/components/CodemirrorEditor/useCodemirror.ts'
import { computed, ref } from 'vue'
import { minimalSetup } from 'codemirror'
import theme from './theme.ts'
import { useFormSize } from 'element-plus'
import type { Diagnostic } from '@codemirror/lint'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { type ViewUpdate } from '@codemirror/view'

defineOptions({
  name: 'CodemirrorEditor',
})

type Props = {
  rows?: number
  maxRows?: number
  autosize?: boolean
  popup?: boolean
} & CodemirrorOptions

const {
  rows = 1,
  maxRows = 0,
  autosize = false,
  placeholder,
  readOnly = false,
  noWrap = false,
  autoWrap = true,
  autofocus = false,
  popup = false,
  extensions = [],
} = defineProps<Props>()
const emits = defineEmits<{
  (e: 'change', val: string): void
  (e: 'keydown', ke: KeyboardEvent): void
  (e: 'lint', messages: Diagnostic[]): void
  (e: 'focus', vu: ViewUpdate): void
  (e: 'blur', vu: ViewUpdate): void
}>()
const formSize = useFormSize()
const fullScreen = ref(false)
const modelValue = defineModel<string | undefined>({ required: true })
const container = ref<HTMLDivElement>()
const inputHeight = computed(
  () => `${formSize.value === 'small' ? 24 : formSize.value === 'large' ? 40 : 32}px`,
)
const innerHeight = computed(() => `${16.8 * (rows <= 0 ? 1 : rows)}px`)
const innerMaxHeight = computed(() => `${16.8 * (maxRows <= 0 ? 1 : maxRows)}px`)
const options = computed<CodemirrorOptions>(() => {
  return {
    extensions: [minimalSetup, theme, ...extensions],
    autofocus: autofocus,
    placeholder: placeholder,
    autoWrap: autoWrap,
    noWrap: noWrap,
    readOnly: readOnly,
    onChange(val) {
      emits('change', val)
    },
    onKeyDown(e) {
      emits('keydown', e)
    },
    onLint(messages) {
      emits('lint', messages)
    },
    onFocus(vu) {
      emits('focus', vu)
    },
    onBlur(vu) {
      emits('blur', vu)
    },
  }
})
const { focus, getSelection, editorView, editorState } = useCodemirror(
  container,
  modelValue,
  options,
)
const toggleFullScreen = () => {
  if (popup) {
    fullScreen.value = !fullScreen.value
  }
}
defineExpose({
  focus,
  getSelection,
  editorView,
  editorState,
})
</script>

<template>
  <div :class="['codemirror-input', { 'el-full-screen': fullScreen }]">
    <div :class="['codemirror-input__wrapper', { 'items-center': rows <= 1 && !fullScreen }]">
      <span
        :class="['codemirror-input__prefix', { popup: popup }]"
        @click="toggleFullScreen"
        :title="popup && !fullScreen ? '全屏显示' : '退出全屏'"
      >
        <slot name="prefix">
          <SvgIcon name="function-outlined" :size="15" />
        </slot>
      </span>
      <div
        ref="container"
        :class="[
          'codemirror-input__inner',
          { 'height-autosize': autosize },
          { 'height-fixed': !autosize },
          { 'height-max': maxRows && maxRows > 0 },
        ]"
      />
      <span class="codemirror-input__suffix">
        <slot name="suffix" />
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.el-full-screen {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 500;
  margin-top: 0;
  padding: 15px;
  box-sizing: border-box;
  background-color: var(--el-bg-color);

  :deep(.cm-editor) {
    min-height: 100% !important;
  }
}

.height-fixed {
  :deep(.cm-editor) {
    // height: v-bind(innerHeight);
  }
}

.height-max {
  :deep(.cm-editor) {
    max-height: v-bind(innerMaxHeight);
  }
}

.height-autosize {
  :deep(.cm-editor) {
    min-height: v-bind(innerHeight);
  }
}

.codemirror-input {
  display: inline-flex;
  box-sizing: border-box;
  min-height: v-bind(inputHeight);
  width: 100%;
  position: relative;

  .codemirror-input__wrapper {
    display: inline-flex;
    flex-grow: 1;
    width: 100%;
    border: var(--el-border);
    border-radius: var(--el-border-radius-base);

    &.items-center {
      align-items: center;
    }

    &:focus-within {
      outline: none;
      border-color: var(--el-color-primary);
    }

    .codemirror-input__prefix {
      border-radius: calc(var(--el-border-radius-base) - 1px) 0 0
        calc(var(--el-border-radius-base) - 1px);

      &.popup {
        cursor: pointer;

        &:hover {
          color: var(--el-color-primary);
          background-color: var(--el-color-primary-light-9);
        }
      }
    }

    .codemirror-input__suffix {
      border-radius: 0 calc(var(--el-border-radius-base) - 1px)
        calc(var(--el-border-radius-base) - 1px) 0;
    }

    .codemirror-input__prefix,
    .codemirror-input__suffix {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--el-color-info);
      background-color: var(--el-fill-color-light);
    }

    .codemirror-input__inner {
      cursor: text;
      width: 100%;
      padding: 1px;
    }
  }
}
</style>
