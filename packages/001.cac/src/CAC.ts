import Command from './Command'
class CAC {
  name: string
  commands: Command[] = []
  constructor(name: string) {
    this.name = name
  }

  command(rawName: string, description: string) {
    const command = new Command(rawName, description)
    this.commands.push(command)
    return command
  }
}

export default CAC
