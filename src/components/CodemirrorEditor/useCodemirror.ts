import {
  ref,
  isRef,
  unref,
  watch,
  toRaw,
  onMounted,
  customRef,
  onUnmounted,
  type Ref,
  type ShallowRef,
  type WritableComputedRef,
} from 'vue'
import { EditorView, placeholder, type ViewUpdate } from '@codemirror/view'
import { Compartment, EditorState, type Extension, StateEffect } from '@codemirror/state'
import { type Diagnostic, setDiagnosticsEffect } from '@codemirror/lint'

export interface CodemirrorOptions {
  // 扩展插件
  extensions?: any[]
  // 占位符
  placeholder?: string
  // 是否支持换行
  noWrap?: boolean
  // 是否自动换行
  autoWrap?: boolean
  // 是否只读
  readOnly?: boolean
  // 是否自动聚焦
  autofocus?: boolean
  // 修改事件
  onChange?: (val: string) => void
  // 错误提示
  onLint?: (messages: Diagnostic[]) => void
  // 按键事件
  onKeyDown?: (e: KeyboardEvent) => void
  // 失去焦点事件
  onBlur?: (vu: ViewUpdate) => void
  // 获取焦点事件
  onFocus?: (vu: ViewUpdate) => void
}

type MaybeRef<T = any> = T | Ref<T> | ShallowRef<T> | WritableComputedRef<T>
const useCodemirror = (
  container: Ref<HTMLElement | undefined>,
  codeValue?: Ref<string | undefined>,
  options?: MaybeRef<CodemirrorOptions>,
) => {
  const _options = unref(options) ?? {}
  const editorView = ref<EditorView>()
  const editorState = ref<EditorState>()
  const changeHandlerExtension = EditorView.updateListener.of((update) => {
    const diagnosticEffects = update.transactions
      .flatMap((t) => t.effects)
      .filter((effect) => effect.is(setDiagnosticsEffect))
    if (diagnosticEffects.length) {
      const messages = diagnosticEffects.flatMap((effect) => effect.value)
      _options?.onLint && _options?.onLint(messages)
    }

    if (update.docChanged) {
      _options?.onChange && _options?.onChange(update.state.doc.toString())
      if (codeValue) {
        codeValue.value = update.state.doc.toString()
      } else {
        value.value = update.state.doc.toString()
      }
    }

    if (update.focusChanged) {
      if (update.view.hasFocus) {
        _options?.onFocus && _options?.onFocus(update)
      } else {
        _options?.onBlur && _options?.onBlur(update)
      }
    }
  })
  const keyHandler = EditorView.domEventHandlers({ keydown: _options.onKeyDown })
  const noWrapExtension = EditorState.transactionFilter.of((tr) => {
    if (tr.docChanged && tr.newDoc.lines > 1) {
      return []
    }
    return tr
  })
  watch(container, (el) => {
    if (el && !editorView.value) {
      initCodemirror()
    }
  })
  if (codeValue) {
    watch(codeValue, (newValue) => {
      if (newValue !== editorView.value?.state.doc.toString()) {
        editorView.value?.dispatch({
          changes: {
            from: 0,
            to: editorView.value.state.doc.length,
            insert: newValue,
          },
        })
      }
    })
  }
  if (options && isRef(options)) {
    watch(
      () => options.value.extensions,
      (newValue) => {
        reExtensions(newValue ?? [])
      },
    )
    watch(
      () => options.value.placeholder,
      (newValue) => {
        rePlaceholder(placeholder(newValue ?? ''))
      },
    )
    watch(
      () => options.value.readOnly,
      (newValue) => {
        toggleReadOnly(!!newValue)
      },
    )
    watch(
      () => options.value.noWrap,
      (newValue) => {
        toggleNoWrap(!!newValue)
      },
    )
    watch(
      () => options.value.autoWrap,
      (newValue) => {
        toggleAutoWrap(!!newValue)
      },
    )
  }
  const getSelection = () => {
    return editorView.value?.state.selection
  }
  const focus = (position: number) => {
    editorView.value?.contentDOM.focus()
    editorView.value?.focus()
    const end = editorView.value?.state.doc.length || 0
    editorView.value?.dispatch({
      selection: {
        anchor: position <= end ? position : end,
      },
    })
  }
  const createCompartment = () => {
    const compartment = new Compartment()
    const run = (extension: Extension) => {
      if (!editorView.value) {
        return
      }
      if (extension && !Array.isArray(extension)) {
        extension = [extension]
      }
      compartment.get(editorView.value.state)
        ? editorView.value.dispatch({ effects: compartment.reconfigure(extension) })
        : editorView.value.dispatch({
            effects: StateEffect.appendConfig.of(compartment.of(extension)),
          })
    }
    return {
      run,
      compartment,
    }
  }
  const createExtensionToggle = (extension: Extension) => {
    const { compartment, run } = createCompartment()
    return (targetApply?: boolean) => {
      if (editorView.value) {
        const exExtension = compartment.get(editorView.value.state)
        const apply = targetApply ?? exExtension !== extension
        run(apply ? extension : [])
      }
    }
  }
  const createExtensionToggleRef = (extension: Extension) => {
    const { compartment, run } = createCompartment()
    return customRef<boolean>((track, trigger) => {
      return {
        get() {
          track()
          if (editorView.value) {
            const exExtension = compartment.get(editorView.value.state)
            return !!exExtension && Array.isArray(exExtension) ? exExtension.length > 0 : false
          }
          return false
        },
        set(newValue: boolean) {
          if (editorView.value) {
            const exExtension = compartment.get(editorView.value.state)
            const apply = newValue ?? exExtension !== extension
            run(apply ? extension : [])
            trigger()
          }
        },
      }
    })
  }
  const initCodemirror = () => {
    if (!container.value) {
      return
    }
    editorState.value = EditorState.create({
      doc: codeValue?.value || '',
      extensions: [keyHandler, changeHandlerExtension],
    })
    editorView.value = new EditorView({
      state: toRaw(editorState.value),
      parent: container.value,
    })
    if (_options.extensions) {
      reExtensions(_options.extensions)
    }
    if (_options.autofocus) {
      editorView.value.focus()
    }
    if (_options.readOnly) {
      toggleReadOnly(true)
    }
    if (_options.noWrap) {
      toggleNoWrap(true)
    }
    if (_options.autoWrap) {
      toggleAutoWrap(true)
    }
    if (_options.placeholder) {
      rePlaceholder(placeholder(_options.placeholder))
    }
    /*editorView.value?.dispatch({
      effects: StateEffect.appendConfig.of(javascriptLanguage.data.of({
        autocomplete: completeFromList([
          {
            label: 'getVariable',
            type: 'function',
            apply: 'getVariable()',
            detail: '获取变量值',
            info: '获取指定变量的值',
          },
        ])
      }))
    })*/
  }
  onMounted(() => {
    initCodemirror()
  })
  onUnmounted(() => {
    editorView.value?.destroy()
    editorView.value = undefined
    editorState.value = undefined
  })
  const toggleReadOnly = createExtensionToggle([
    EditorView.editable.of(false),
    EditorState.readOnly.of(true),
  ])
  const toggleNoWrap = createExtensionToggle(noWrapExtension)
  const toggleAutoWrap = createExtensionToggle(EditorView.lineWrapping)
  const value = customRef<string>((track, trigger) => {
    return {
      get() {
        track()
        return editorView.value?.state.doc.toString() || ''
      },
      set(newValue: string) {
        if (editorView.value) {
          if (newValue !== editorView.value.state.doc.toString()) {
            editorView.value.dispatch({
              changes: {
                from: 0,
                to: editorView.value.state.doc.length,
                insert: newValue,
              },
            })
          }
        }
        trigger()
      },
    }
  })
  const { run: rePlaceholder } = createCompartment()
  const { run: reExtensions } = createCompartment()
  return {
    focus,
    getSelection,
    createExtensionToggle,
    createExtensionToggleRef,
    initCodemirror,
    value,
    editorView,
    editorState,
  }
}

export default useCodemirror
