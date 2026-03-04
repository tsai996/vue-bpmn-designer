export interface Connector {
  id: string
  name: string
  version?: number
  description?: string
  appliesTo: string[]
  elementType?: {
    value: string
    eventDefinition?: string
  }
  properties?: ConnectorProperty[]
  icon?: {
    contents: string
  }
  documentationRef?: string
  category?: {
    id: string
    name: string
  }
}

interface ConnectorProperty {
  label?: string
  type: 'String' | 'Text' | 'Boolean' | 'Dropdown' | 'Hidden'
  value?: string | boolean
  condition?: Condition
  optional?: boolean
  feel?: string
  choices?: DropdownChoice[]
  binding: Binding
  constraints?: Constraints
  description?: string
  group?: string
}

interface Condition {
  property: string
  equals: string
  type: 'simple' | 'complex'
}

interface DropdownChoice {
  name: string
  value: string
}

interface Constraints {
  notEmpty?: boolean
  maxLength?: number
  pattern?: {
    value: string
    message: string
  }
}

interface Binding {
  type: string
  name: string
  value?: string
  expression?: string
}
