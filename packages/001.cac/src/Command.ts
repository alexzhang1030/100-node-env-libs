import Option from './Option'
import type { BracketType } from './utils'
import { findBrackets } from './utils'

class Command {
  commandAction?: (...args: unknown[]) => any
  options: Option[] = []
  args: BracketType[] = []

  constructor(public rawName: string, public description: string) {
    this.args = findBrackets(rawName)
  }

  action(callback: (...args: unknown[]) => any) {
    this.commandAction = callback
    return this
  }

  option(rawName: string, description: string) {
    const option = new Option(rawName, description)
    this.options.push(option)
    return this
  }

  isMatched(commandName: string) {
    return this.rawName === commandName
  }
}

export default Command
