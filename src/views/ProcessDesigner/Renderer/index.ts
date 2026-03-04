import VariableEventRenderer from './RewriteRenderer/VariableEventRenderer.ts'
import ConnectorIconRenderer from './RewriteRenderer/ConnectorIconRenderer'
import ExclusiveGatewayRender from '@/views/ProcessDesigner/Renderer/RewriteRenderer/ExclusiveGatewayRender.ts'

const httpTaskRenderer = {
  __init__: [
    'variableEventRenderer',
    'connectorIconRenderer',
    'neutralElementColors',
    'exclusiveGatewayRender',
  ],
  variableEventRenderer: ['type', VariableEventRenderer],
  neutralElementColors: ['type', class {}],
  connectorIconRenderer: ['type', ConnectorIconRenderer],
  exclusiveGatewayRender: ['type', ExclusiveGatewayRender],
}

export default httpTaskRenderer
