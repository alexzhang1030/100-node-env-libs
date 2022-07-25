import type { ServerResponse } from 'http'

export function processRedirect(response: ServerResponse, target: string): void {
  const defaultType = 301
  response.writeHead(defaultType, 'Moved Permanently', {
    Location: target,
  })
  response.end()
}
