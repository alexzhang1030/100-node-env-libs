import { createReadStream, existsSync } from 'fs'
import type { IncomingMessage, ServerResponse } from 'http'
import { resolve } from 'path'
import { processRedirect } from './redirect'
import type { Opts } from './types'

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

export default function (request: IncomingMessage, response: ServerResponse, opts?: Opts) {
  const cwd = getCurrentWorkDir()
  const relatedPath = request.url!.slice(1)
  const path = resolve(cwd, relatedPath)
  // process 404 error
  if (!existsSync(path)) {
    processError(404, response)
    return
  }
  // process redirect
  if (opts && opts.redirect) {
    const { redirect } = opts
    const redirectTarget = redirect.find(item => item.origin === relatedPath)
    if (redirectTarget) {
      processRedirect(response, redirectTarget.target)
      return
    }
  }
  createReadStream(path).pipe(response)
}
