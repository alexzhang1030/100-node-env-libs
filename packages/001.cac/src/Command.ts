import Option from './Option'

class Command {
  commandAction?: (...args: any[]) => any
  options: Option[] = []

  constructor(public rawName: string, public description: string) {
  }

  action(callback: (...args: any[]) => any) {
    this.commandAction = callback
    return this
  }

  option(rawName: string, description: string) {
    const option = new Option(rawName, description)
    this.options.push(option)
    return this
  }
}

export default Command
