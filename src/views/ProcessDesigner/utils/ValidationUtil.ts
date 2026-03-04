import type { Element } from 'bpmn-js/lib/model/Types.ts'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'

export const isIdValid = (element: Element, idValue: string) => {
  element = getBusinessObject(element)
  const assigned = element.$model.ids.assigned(idValue)
  const idAlreadyExists = assigned && assigned !== element
  if (!idValue) {
    return 'id不能为空'
  }
  if (idAlreadyExists) {
    return 'id必须唯一'
  }
  return validateId(idValue)
}

const validateId = (idValue: string) => {
  if (/\s/.test(idValue)) {
    return 'id不能包含空格'
  }

  if (!/^[a-z_][\w-.]*$/i.test(idValue)) {
    if (/^([a-z][\w-.]*:)?[a-z_][\w-.]*$/i.test(idValue)) {
      return 'id不得包含前缀'
    }
    return 'id必须是有效的QName'
  }
}

export const isExpressionValid = (str: string) => {
  const reg = /^[$#]{\s*.*\s*}$/
  return reg.test(str)
}

export const isClassValid = (str: string) => {
  const reg = /^([a-z_][a-z0-9_]*\.)*[a-zA-Z_][a-zA-Z0-9_]*$/
  return reg.test(str)
}

export const isClassExpressionValid = (str: string) => {
  const reg = /^(\$\{|#\{)[a-zA-Z0-9_$]+\.[a-zA-Z0-9_$]+\.[a-zA-Z0-9_$]+\(.*\)}$/
  return reg.test(str)
}

export const isDelegateExprValid = (str: string, contain: boolean = false) => {
  const reg = contain
    ? /(\$\{|#\{)\s*[a-zA-Z_][a-zA-Z0-9_]*\s*}/
    : /^(\$\{|#\{)\s*[a-zA-Z_][a-zA-Z0-9_]*\s*}$/
  return reg.test(str)
}

export const isIso8601DurationValid = (str: string) => {
  const reg = /^P(?!$)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/
  return reg.test(str)
}

export const isRepeatIntervalValid = (str: string) => {
  const reg =
    /^R(\d+)?\/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\/P(T(\d+H)?(\d+M)?(\d+S)?|(\d+D)?(T(\d+H)?(\d+M)?(\d+S)?)?)$/
  return reg.test(str)
}

export const isCronValid = (str: string) => {
  const reg5 =
    /^(\*|([0-5]?\d))( +(\*|([01]?\d|2[0-3])))( +(\*|([01]?\d|2[0-9]|3[01])))( +(\*|(1[0-2]|0?[1-9])))( +(\*|([0-6]|SUN|MON|TUE|WED|THU|FRI|SAT)))$/i
  const reg6 =
    /^(\*|[0-5]?\d) (\*|[0-5]?\d) (\*|[01]?\d|2[0-3]) (\*|[01]?\d|2[0-9]|3[01]|\?) (\*|1[0-2]|0?[1-9]) (\*|\?|[0-7]|SUN|MON|TUE|WED|THU|FRI|SAT)$/i
  return reg5.test(str) || reg6.test(str)
}
