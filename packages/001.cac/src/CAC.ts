import mri from 'mri'
import Command from './Command'
class CAC {
  name: string
  commands: Command[] = []
  matchedCommand?: Command
  constructor(name: string) {
    this.name = name
  }

  command(rawName: string, description: string) {
    const command = new Command(rawName, description)
    this.commands.push(command)
    return command
  }

  parse(argv: string[]) {
    const rawArgs = argv || process.argv
    const { args } = this.mri(rawArgs.slice(2))
    for (const command of this.commands) {
      const commandName = args[0]
      if (commandName === command.rawName)
        this.matchedCommand = command
    }
    this.runMatchedCommand()
  }

  private mri(argv: string[]) {
    const parsed = mri(argv)
    const args = parsed._
    return {
      args,
    }
  }

  runMatchedCommand() {
    return this.matchedCommand?.commandAction?.apply(this)
  }
}

export default CAC
