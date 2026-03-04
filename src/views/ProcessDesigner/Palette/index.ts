import { type ModuleDeclaration } from 'didi'
import CustomPaletteProvider from './CustomPaletteProvider'

const RerenderPalette: ModuleDeclaration = {
  __init__: ['paletteProvider'],
  paletteProvider: ['type', CustomPaletteProvider],
}

export default RerenderPalette
