export interface ParsedQuery {
  freeText: string
  operators: { key: string; value: string }[]
}

const OPERATOR_PATTERN = /(\w+):(\S+)/g

export function parseSearchQuery(raw: string): ParsedQuery {
  const operators: { key: string; value: string }[] = []
  let match
  while ((match = OPERATOR_PATTERN.exec(raw)) !== null) {
    operators.push({ key: match[1], value: match[2] })
  }
  const freeText = raw.replace(OPERATOR_PATTERN, '').trim()
  return { freeText, operators }
}