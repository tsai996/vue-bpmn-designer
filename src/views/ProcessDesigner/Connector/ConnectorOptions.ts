import type { Connector } from '@/types/connector.ts'
// dmn
export const TASK_CONNECTOR: Connector[] = [
  {
    id: 'io.flowable.connectors.HttpConnector-s1',
    name: 'Http task',
    version: 1,
    description: 'A Http API invocation task.',
    appliesTo: ['bpmn:Task'],
    elementType: {
      value: 'bpmn:ServiceTask',
    },
    category: {
      id: 'connector',
      name: 'Connectors',
    },
    documentationRef: 'http://182.61.39.195:4080/',
    icon: {
      contents: '#icon-http-service',
    },
    properties: [
      {
        type: 'Hidden',
        value: 'http',
        binding: {
          type: 'property',
          name: 'type',
        },
      },
      {
        label: 'REST Method',
        description: 'Specify the HTTP method to use.',
        type: 'Dropdown',
        value: 'GET',
        choices: [
          { name: 'GET', value: 'GET' },
          { name: 'POST', value: 'POST' },
          { name: 'PUT', value: 'PUT' },
          { name: 'DELETE', value: 'DELETE' },
        ],
        binding: {
          type: 'flowable:field',
          name: 'requestMethod',
        },
      },
      {
        label: 'REST Endpoint URL',
        description: 'Specify the url of the REST API to talk to.',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'requestUrl',
        },
        constraints: {
          notEmpty: true,
          pattern: {
            value: '^https?://.*',
            message: 'Must be http(s) URL.',
          },
        },
      },
      {
        label: 'Request Headers',
        description: 'Headers to send to the endpoint.',
        value: undefined,
        type: 'String',
        optional: true,
        binding: {
          type: 'flowable:field',
          name: 'requestHeaders',
        },
      },
      {
        label: 'Request Body',
        description: 'Data to send to the endpoint.',
        value: undefined,
        type: 'String',
        optional: true,
        binding: {
          type: 'flowable:field',
          name: 'requestBody',
        },
      },
      {
        label: 'Ignore Exception',
        description: 'Ignore exception if the request fails.',
        type: 'Boolean',
        value: false,
        binding: {
          type: 'flowable:field',
          name: 'ignoreException',
        },
      },
      {
        label: 'Disallow Redirects',
        description: 'Disallow redirects.',
        type: 'Boolean',
        value: false,
        binding: {
          type: 'flowable:field',
          name: 'disallowRedirects',
        },
      },
      {
        label: 'Save Response Variable As Json',
        description: 'Save response variable as json.',
        type: 'Boolean',
        value: false,
        binding: {
          type: 'flowable:field',
          name: 'saveResponseVariableAsJson',
        },
      },
      {
        label: 'Save Response Parameters Transient',
        description: 'Save response parameters transient.',
        type: 'Boolean',
        value: false,
        binding: {
          type: 'flowable:field',
          name: 'saveResponseParametersTransient',
        },
      },
      {
        label: 'Result Variable',
        description: 'Name of variable to store the response data in.',
        value: 'response',
        type: 'String',
        optional: true,
        binding: {
          type: 'flowable:field',
          name: 'resultVariablePrefix',
        },
      },
    ],
  },
  {
    id: 'io.flowable.connectors.CcConnector-s1',
    name: 'Cc task',
    version: 1,
    description: 'A Cc API invocation task.',
    appliesTo: ['bpmn:Task'],
    elementType: {
      value: 'bpmn:ServiceTask',
    },
    category: {
      id: 'connector',
      name: 'Connectors',
    },
    documentationRef: 'http://182.61.39.195:4080/',
    icon: {
      contents: '#icon-cc-service',
    },
    properties: [
      {
        type: 'Hidden',
        value: 'cc',
        binding: {
          type: 'property',
          name: 'type',
        },
      },
      {
        label: 'Assignee',
        description: 'assignee',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'assignee',
        },
        constraints: {
          notEmpty: true,
        },
      },
    ],
  },
  {
    id: 'io.flowable.connectors.CamelConnector-s1',
    name: 'Camel task',
    version: 1,
    description: 'A Camel API invocation task.',
    appliesTo: ['bpmn:Task'],
    elementType: {
      value: 'bpmn:ServiceTask',
    },
    category: {
      id: 'connector',
      name: 'Connectors',
    },
    documentationRef: 'http://182.61.39.195:4080/',
    icon: {
      contents: '#icon-camel-service',
    },
    properties: [
      {
        type: 'Hidden',
        value: 'camel',
        binding: {
          type: 'property',
          name: 'type',
        },
      },
      {
        label: 'Camel Content',
        description: 'Camel Content',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'camelContext',
        },
        constraints: {
          notEmpty: true,
        },
      },
    ],
  },
  {
    id: 'io.flowable.connectors.ShellConnector-s1',
    name: 'Shell task',
    version: 1,
    description: 'A Shell API invocation task.',
    appliesTo: ['bpmn:Task'],
    elementType: {
      value: 'bpmn:ServiceTask',
    },
    category: {
      id: 'connector',
      name: 'Connectors',
    },
    documentationRef: 'http://182.61.39.195:4080/',
    icon: {
      contents: '#icon-shell-service',
    },
    properties: [
      {
        type: 'Hidden',
        value: 'shell',
        binding: {
          type: 'property',
          name: 'type',
        },
      },
      {
        label: 'command',
        description: 'command',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'command',
        },
        constraints: {
          notEmpty: true,
        },
      },
      {
        label: 'Output Variable',
        description: 'Output Variable',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'outputVariable',
        },
      },
      {
        label: 'Wait',
        description: 'wait',
        value: 'true',
        type: 'Boolean',
        binding: {
          type: 'flowable:field',
          name: 'wait',
        },
      },
      {
        label: 'Redirect Error',
        description: 'Redirect Error',
        type: 'Boolean',
        binding: {
          type: 'flowable:field',
          name: 'redirectError',
        },
      },
      {
        label: 'Clean Env',
        description: 'Clean Env',
        type: 'Boolean',
        binding: {
          type: 'flowable:field',
          name: 'cleanEnv',
        },
      },
      {
        label: 'directory',
        description: 'directory',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'directory',
        },
      },
      {
        label: 'Error Code Variable',
        description: 'Error Code Variable',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'errorCodeVariable',
        },
      },
    ],
  },
  {
    id: 'io.flowable.connectors.EmailConnector-s1',
    name: 'Email task',
    version: 1,
    description: 'A Email sending task.',
    appliesTo: ['bpmn:Task'],
    elementType: {
      value: 'bpmn:ServiceTask',
    },
    category: {
      id: 'connector',
      name: 'Connectors',
    },
    documentationRef: 'http://182.61.39.195:4080/',
    icon: {
      contents: '#icon-email-service',
    },
    properties: [
      {
        type: 'Hidden',
        value: 'email',
        binding: {
          type: 'property',
          name: 'type',
        },
      },
      {
        label: 'to',
        description: 'to',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'to',
        },
        constraints: {
          notEmpty: true,
        },
      },
      {
        label: 'Cc',
        description: 'Cc',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'cc',
        },
      },
      {
        label: 'Bcc',
        description: 'Bcc',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'bcc',
        },
      },
      {
        label: 'Subject',
        description: 'Subject',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'subject',
        },
      },
      {
        label: 'Text',
        description: 'Text',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'text',
        },
      },
    ],
  },
  {
    id: 'io.flowable.connectors.ExternalConnector-s1',
    name: 'External worker task',
    version: 1,
    description: 'A External API invocation task.',
    appliesTo: ['bpmn:Task'],
    elementType: {
      value: 'bpmn:ServiceTask',
    },
    category: {
      id: 'connector',
      name: 'Connectors',
    },
    documentationRef: 'http://182.61.39.195:4080/',
    icon: {
      contents: '#icon-external-worker-service',
    },
    properties: [
      {
        type: 'Hidden',
        value: 'external-worker',
        binding: {
          type: 'property',
          name: 'type',
        },
      },
      {
        label: 'Topic',
        description: 'Topic',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'topic',
        },
        constraints: {
          notEmpty: true,
        },
      },
    ],
  },
  {
    id: 'io.flowable.connectors.DecisionConnector-s1',
    name: 'Decision task',
    version: 1,
    description: 'A Decision task.',
    appliesTo: ['bpmn:Task'],
    elementType: {
      value: 'bpmn:ServiceTask',
    },
    category: {
      id: 'connector',
      name: 'Connectors',
    },
    documentationRef: 'http://182.61.39.195:4080/',
    icon: {
      contents: '#icon-decision-service',
    },
    properties: [
      {
        type: 'Hidden',
        value: 'dmn',
        binding: {
          type: 'property',
          name: 'type',
        },
      },
      {
        label: 'Decision Reference',
        description: 'Decision Table',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'decisionTableReferenceKey',
        },
      },
      {
        label: 'Throw Error On No Hits',
        description: 'Throw Error On No Hits',
        type: 'Boolean',
        binding: {
          type: 'flowable:field',
          name: 'decisionTaskThrowErrorOnNoHits',
        },
      },
      {
        label: 'Same Deployment',
        description: 'Same Deployment',
        type: 'Boolean',
        value: 'false',
        binding: {
          type: 'flowable:field',
          name: 'sameDeployment',
        },
      },
    ],
  },
  {
    id: 'io.flowable.connectors.MuleConnector-s1',
    name: 'Mule task',
    version: 1,
    description: 'A Mule task.',
    appliesTo: ['bpmn:Task'],
    elementType: {
      value: 'bpmn:ServiceTask',
    },
    category: {
      id: 'connector',
      name: 'Connectors',
    },
    documentationRef: 'http://182.61.39.195:4080/',
    icon: {
      contents: '#icon-mule-service',
    },
    properties: [
      {
        type: 'Hidden',
        value: 'mule',
        binding: {
          type: 'property',
          name: 'type',
        },
      },
      {
        label: 'Endpoint Url',
        description: 'Endpoint Url',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'endpointUrl',
        },
      },
      {
        label: 'Language',
        description: 'Language',
        type: 'String',
        value: 'juel',
        binding: {
          type: 'flowable:field',
          name: 'language',
        },
      },
      {
        label: 'Payload Expression',
        description: 'Payload Expression',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'payloadExpression',
        },
      },
      {
        label: 'Result Variable',
        description: 'Result Variable',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'resultVariable',
        },
      },
    ],
  },
  /*{
    id: 'io.flowable.connectors.JumpConnector-s1',
    name: 'Jump task',
    version: 1,
    description: 'A Jump task.',
    appliesTo: ['bpmn:Task'],
    elementType: {
      value: 'bpmn:ServiceTask',
    },
    category: {
      id: 'connector',
      name: 'Connectors',
    },
    documentationRef: 'http://182.61.39.195:4080/',
    icon: {
      contents: '#icon-jump-service',
    },
    properties: [
      {
        type: 'Hidden',
        value: 'jump',
        binding: {
          type: 'property',
          name: 'type',
        },
      },
      {
        label: 'Target Node',
        description: 'Target Node',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'targetNodeId',
        },
      },
      {
        label: 'Condition Expression',
        description: 'Condition Expression',
        type: 'String',
        binding: {
          type: 'flowable:field',
          name: 'conditionExpression',
        },
      },
    ],
  },*/
]

const CONNECTORS: Connector[] = [...TASK_CONNECTOR]
export default CONNECTORS
