declare module 'bpmn-js-token-simulation' {
  import type { ModuleDefinition } from 'didi'
  const SimulationModeler: ModuleDefinition
  export default SimulationModeler
}

declare module 'bpmn-js-token-simulation/lib/features/toggle-mode/modeler/ToggleMode' {
  export default class ToggleMode {
    _active = false
    constructor()
    toggleMode(): void
  }
}
