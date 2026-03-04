declare module 'bpmnlint/config/recommended' {
  import type { Config } from 'bpmnlint/lib/types'
  const config: Config
  export default config
}
declare module 'bpmnlint/lib/resolver/static-resolver' {
  import type { Config, RuleFactory } from 'bpmnlint/lib/types'

  class StaticResolver {
    constructor(cache: Record<string, unknown>)

    resolveRule(pkg: string, ruleName: string): RuleFactory

    resolveConfig(pkg: string, configName: string): Config

    protected resolve(type: 'rule' | 'config', pkg: string, name: string): RuleFactory | Config
  }
  export = StaticResolver
}
declare module 'bpmnlint/rules/*' {
  import type { RuleDefinition } from 'bpmnlint/lib/types'
  const rule: () => RuleDefinition
  export default rule
}
