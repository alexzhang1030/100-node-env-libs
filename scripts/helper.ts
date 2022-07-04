import type { NeededInfo } from './types'
/**
 * fill number
 *
 * @param n number to be checked
 * @param count number of digits
 * @param fill fill string
 */
export const normalizeCount = (n: number, count: number, fill: string) => {
  const str = n.toString()
  const len = str.length
  if (len < count) {
    const diff = count - len
    const fillStr = new Array(diff).fill(fill).join('')
    return fillStr + str
  }
  return str
}

/**
 * inject needed content
 *
 * @param info needed info
 * @param content original content
 * @returns injected message content
 */
export const injectMessage = (info: NeededInfo, content: string) => {
  const { name, link, description } = info
  const message = content.replace(/\$\{lib-name\}/g, name)
    .replace(/\$\{lib-link\}/g, link)
    .replace(/\$\{lib-description\}/g, description)
  return message
}
