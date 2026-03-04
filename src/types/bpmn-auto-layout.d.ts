declare module 'bpmn-auto-layout' {
  const layoutProcess: (xml: string) => Promise<string>
  export { layoutProcess }
}
