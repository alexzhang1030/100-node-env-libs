import mri from 'mri'
import Command from './Command'

const processArgs = process.argv

interface ParsedInfo {
  args: ReadonlyArray<string>
  options: Record<string, boolean | string>
}

class CAC {
  name: string
  commands: Command[] = []
  matchedCommand?: Command
  rawArgs: string[] = []
  args: ParsedInfo['args'] = []
  options: ParsedInfo['options'] = {}

  constructor(name: string) {
    this.name = name
  }

  command(rawName: string, description = '') {
    const command = new Command(rawName, description)
    this.commands.push(command)
    return command
  }

  parse(argv: string[] = processArgs) {
    this.rawArgs = argv
    const { args, options } = this.mri(this.rawArgs.slice(2))
    for (const command of this.commands) {
      const commandName = args[0]
      if (command.isMatched(commandName))
        this.setParsedInfo({ args, options }, command)
    }
    this.runMatchedCommand()
  }

  private setParsedInfo({ args, options }: ParsedInfo, matchedCommand?: Command) {
    this.args = args
    this.options = options

    if (matchedCommand) this.matchedCommand = matchedCommand
  }

  private mri(argv: string[]) {
    const parsed = mri(argv)
    const args = parsed._

    // 创建一个对象，用于接收 options
    const options = Object.create(null)

    for (const key of Object.keys(parsed)) {
      if (key !== '_')
        options[key] = parsed[key]
    }

    return {
      args,
      options,
    }
  }

  runMatchedCommand() {
    const { args, options, matchedCommand: command } = this
    if (!command || !command.commandAction) return
    const actionArgs = []
    // TODO 这里应该使用 command 注册的指令
    actionArgs.push(...args.slice(1))
    actionArgs.push(options)
    return command.commandAction.apply(this, actionArgs)
  }
}

export default CAC
