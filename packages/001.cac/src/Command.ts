import Option from './Option'

class Command {
  commandAction?: (...args: unknown[]) => any
  options: Option[] = []

  constructor(public rawName: string, public description: string) {
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
