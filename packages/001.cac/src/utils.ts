export interface BracketType { required: boolean; value: string }

export function findBrackets(v: string) {
  const ANGLED_BRACKET_RE_GLOBAL = /<([^>]+)>/g
  const SQUARE_BRACKET_RE_GLOBAL = /\[([^\]]+)\]/g

  const res: BracketType[] = []

  const parse = (match: string[]) => {
    const value = match[1]
    return {
      required: value.startsWith('<'),
      value,
    }
  }

  let angledMatch = ANGLED_BRACKET_RE_GLOBAL.exec(v)
  while (angledMatch) {
    res.push(parse(angledMatch))
    angledMatch = ANGLED_BRACKET_RE_GLOBAL.exec(v)
  }

  let squareMatch = SQUARE_BRACKET_RE_GLOBAL.exec(v)
  while (squareMatch) {
    res.push(parse(squareMatch))
    squareMatch = SQUARE_BRACKET_RE_GLOBAL.exec(v)
  }
  return res
}
