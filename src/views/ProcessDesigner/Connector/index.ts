import type { ModuleDeclaration } from 'didi'
import ConnectorMenuProvider from './ConnectorMenuProvider.ts'
import ConnectorChooser from './ConnectorChooser.ts'

const connectorTemplate: ModuleDeclaration = {
  __init__: ['connectorMenuProvider', 'connectorChooser'],
  connectorMenuProvider: ['type', ConnectorMenuProvider],
  connectorChooser: ['type', ConnectorChooser],
}

export default connectorTemplate
