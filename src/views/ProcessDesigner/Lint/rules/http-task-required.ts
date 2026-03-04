import type { Reporter, RuleDefinition } from 'bpmnlint/lib/types'
import type { ModdleElement } from 'bpmn-js/lib/model/Types.ts'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { getExtensionElementsList } from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'

const httpTaskRequired = (): RuleDefinition => {
  return {
    check: (node: ModdleElement, reporter: Reporter) => {
      if (is(node, 'bpmn:ServiceTask')) {
        const type = node.get('type')
        if (type === 'http') {
          const fields = getExtensionElementsList(node, 'flowable:Field')
          const requestMethod = fields.find((field) => field.get('name') === 'requestMethod')
          if (!requestMethod?.get('string')) {
            reporter.report(node.id, 'Missing requestMethod')
          }
          const requestUrl = fields.find((field) => field.get('name') === 'requestUrl')
          if (!requestUrl?.get('string')) {
            reporter.report(node.id, 'Missing requestUrl')
          }
          const requestHeaders = fields.find((field) => field.get('name') === 'requestHeaders')
          const headerJson = requestHeaders?.get('string')
          if (headerJson) {
            try {
              const header = JSON.parse(headerJson)
              if (Array.isArray(header)) {
                reporter.report(node.id, 'RequestHeaders should be an object, not an array')
              }
            } catch (e) {
              reporter.report(node.id, 'Invalid JSON format in requestHeaders')
            }
          }
          const requestBody = fields.find((field) => field.get('name') === 'requestBody')
          const bodyJson = requestBody?.get('string')
          if (bodyJson) {
            try {
              JSON.parse(bodyJson)
            } catch (e) {
              reporter.report(node.id, 'Invalid JSON format in requestBody')
            }
          }
        }
      }
    },
    meta: {
      documentation: {
        url: 'https://demo.lowflow.vip/',
      },
    },
  }
}

export default httpTaskRequired
