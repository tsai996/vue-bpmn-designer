import type { ModuleDeclaration } from 'didi'
import { BpmnPropertiesPanelRenderer } from './BpmnPropertiesPanelRenderer.tsx'

const propertiesPanel: ModuleDeclaration = {
  __init__: ['propertiesPanel'],
  propertiesPanel: ['type', BpmnPropertiesPanelRenderer],
}
export default propertiesPanel
