import { createReadStream, existsSync } from 'fs'
import type { IncomingMessage, ServerResponse } from 'http'
import { resolve } from 'path'

export function getCurrentWorkDir() {
  const cwd = process.cwd()
  return resolve(cwd, 'packages/003.serve-handler/__test__/fixtures')
}

const ERROR_CODE_FILE = {
  404: '404.html',
}

function processError(errorCode: keyof typeof ERROR_CODE_FILE, response: ServerResponse) {
  const fileName = ERROR_CODE_FILE[errorCode]
  const filePath = resolve(getCurrentWorkDir(), fileName)
  if (existsSync(filePath)) {
    response.statusCode = errorCode
    response.setHeader('Content-Type', 'text/html')
    createReadStream(filePath).pipe(response)
  }
}

export default function (request: IncomingMessage, response: ServerResponse) {
  const cwd = getCurrentWorkDir()
  const path = resolve(cwd, request.url!.slice(1))
  // process 404 error
  if (!existsSync(path))
    processError(404, response)
  else
    createReadStream(path).pipe(response)
}
