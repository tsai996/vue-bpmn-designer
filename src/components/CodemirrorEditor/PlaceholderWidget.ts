import { WidgetType } from '@codemirror/view'

export class PlaceholderWidget extends WidgetType {
  id: string
  text?: string

  constructor(id: string, text?: string) {
    super()
    this.id = id
    this.text = text
  }

  eq(other: PlaceholderWidget) {
    return this.id === other.id
  }

  toDOM() {
    const spanEl = document.createElement('span')
    spanEl.style.cssText = `
      display: inline-block;
      border: 1px solid var(--el-color-primary-light-8);
      color: var(--el-color-white);
      line-height: 1.32em;
      border-radius: var(--el-border-radius-base);
      padding: 0 8px;
      background-color: var(--el-color-primary);`
    spanEl.textContent = this.text || this.id
    return spanEl
  }

  ignoreEvent() {
    return false
  }

  destroy(dom: HTMLElement) {
    dom.remove()
  }
}

export default PlaceholderWidget
