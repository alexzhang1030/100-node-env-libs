import { createServer } from 'http'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import listen from 'test-listen'
import fetch from 'node-fetch'
import handler, { getCurrentWorkDir } from '../src'

function getURL() {
  const server = createServer((req, res) => {
    handler(req, res)
  })
  return listen(server)
}

const cwd = getCurrentWorkDir()

test('run', async () => {
  const url = await getURL()
  const res = await fetch(`${url}/test.html`)
  const result = await res.text()
  const expected = readFileSync(resolve(cwd, 'test.html'), 'utf8')
  expect(result).toEqual(expected)
})

test('404', async () => {
  const url = await getURL()
  const res = await fetch(`${url}/test_not_really_exist.html`)
  expect(res.status).toMatchInlineSnapshot('404')
  const expected = readFileSync(resolve(cwd, '404.html'), 'utf8')
  expect(await res.text()).toEqual(expected)
})
