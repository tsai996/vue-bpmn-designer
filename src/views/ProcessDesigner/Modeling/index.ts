import CustomBpmnFactory from './CustomBpmnFactory.ts'

const customModeling = {
  __init__: ['bpmnFactory'],
  bpmnFactory: ['type', CustomBpmnFactory],
}

export default customModeling
