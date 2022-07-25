import { createReadStream } from 'fs'
import type { IncomingMessage, ServerResponse } from 'http'
import { resolve } from 'path'

export function getCurrentWorkDir() {
  const cwd = process.cwd()
  return resolve(cwd, 'packages/003.serve-handler/__test__/fixtures')
}

export default function (request: IncomingMessage, response: ServerResponse) {
  const cwd = getCurrentWorkDir()
  const path = resolve(cwd, request.url!.slice(1))
  createReadStream(path).pipe(response)
}
