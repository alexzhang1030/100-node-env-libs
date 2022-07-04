import { resolve } from 'path'
import { readFileSync, readdirSync, writeFileSync } from 'fs'
import MagicString from 'magic-string'
import { copyFile, ensureDirSync } from 'fs-extra'
import fg from 'fast-glob'
import { NL } from '@alexzzz/nl'
import Inquirer from 'inquirer'
import { injectMessage, normalizeCount } from './helper'
import type { NeededInfo } from './types'

const logger = new NL()

const withRoot = (url: string) => resolve(process.cwd(), url)
const withTarget = (url: string) => withRoot(`packages/${url}`)

async function ask(): Promise<NeededInfo> {
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'what\'s this library\'s name?',
    },
    {
      type: 'input',
      name: 'link',
      message: 'what\'s this library\'s github link?',
    },
    {
      type: 'input',
      name: 'description',
      message: 'what\'s this library\'s description?',
    },
  ] as Inquirer.Question[]
  const { name, link, description } = await Inquirer.prompt(questions)
  return {
    name, link, description,
  }
}

async function create(info: NeededInfo): Promise<[number, string]> {
  const files = fg.sync('scripts/template/**/*', { dot: true })
  const packagesCount = readdirSync(withTarget('')).length
  const targetName = `${normalizeCount(packagesCount + 1, 3, '0')}.${info.name}`
  ensureDirSync(withTarget(targetName))
  const copyTasks = []
  for (const file of files)
    copyTasks.push(copyFile(file, withTarget(`${targetName}/${file.split('/').slice(2).join('/')}`)))
  await Promise.allSettled(copyTasks)
  const originalIndexMarkdown = readFileSync(withTarget(`${targetName}/index.md`), 'utf8')
  const injectedMessage = injectMessage(info, originalIndexMarkdown)
  writeFileSync(withTarget(`${targetName}/index.md`), injectedMessage)
  const pkg = {
    name: targetName,
    private: true,
  }
  writeFileSync(withTarget(`${targetName}/package.json`), JSON.stringify(pkg, null, 2))
  return [packagesCount, targetName]
}

function generateList(info: NeededInfo, targetName: string) {
  const originalContent = readFileSync(withRoot('List.md'), 'utf-8')
  const ms = new MagicString(originalContent)
  const left = '<!-- need inject start -->'
  const right = '<!-- need inject end -->'
  const leftIndex = originalContent.indexOf(left)
  const rightIndex = originalContent.indexOf(right)
  const content = `- [${info.name}](./packages/${targetName}/index.md) - [Github](${info.link}): ${info.description}\n${left}\n${right}`
  ms.overwrite(leftIndex + left.length, rightIndex, content)
  const targetContent = ms.toString().replace(left, '').replace(right, '')
  writeFileSync(withRoot('List.md'), targetContent)
}

function generateReadme(count: number) {
  const originalContent = readFileSync(withRoot('README.md'), 'utf-8')
  const ms = new MagicString(originalContent)
  const left = '<!-- progress start -->'
  const right = '<!-- progress end -->'
  const leftIndex = originalContent.indexOf(left)
  const rightIndex = originalContent.indexOf(right)
  const content = `\n<img src="https://img.shields.io/badge/progress-%20${count}-purple.svg" />\n`
  ms.overwrite(leftIndex + left.length, rightIndex, content)
  const targetContent = ms.toString()
  writeFileSync(withRoot('README.md'), targetContent)
}

const withCatch = async (fn: (...args: any[]) => void, ...args: any[]) => {
  try {
    fn(...args)
  }
  catch (error) {
    logger.err(`fail cause: ${error}`)
  }
}

async function main() {
  withCatch(async () => {
    const info = await ask()
    const [count, targetName] = await create(info)
    generateList(info, targetName)
    generateReadme(count + 1)
    logger.end('create success')
  })
}

main()
