export const isDelegateExpression = (str: string) => {
  const reg = /\$\{.*\}/
  return reg.test(str)
}
