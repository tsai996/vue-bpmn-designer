declare module 'diagram-js-minimap' {
  import type { ModuleDefinition } from 'didi'

  export class Minimap {
    toggle: (open: boolean) => void
    isOpen: () => boolean
  }

  const minimap: ModuleDefinition
  export default minimap
}
