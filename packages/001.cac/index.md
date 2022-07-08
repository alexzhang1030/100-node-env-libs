<h1 align="center"><samp>cac</samp></h1>

<p align="center"><a href="https://github.com/cacjs/cac"><img src="https://img.shields.io/badge/-Github-black.svg" /></a></p>

<p align="center"><samp>Simple yet powerful framework for building command-line apps.</samp></p>

[我学到了什么](./output.md)

## Usage

### cac 初印象

根据文档中的一个小 demo, 来试试 cac 能做什么

```ts
import cac from 'cac'

const cli = cac()

cli.option('--type <type>', 'Choose a type', {
  default: 'none',
})

const parsed = cli.parse()

console.log({ parsed })

```

让我们运行起来看看会发生什么效果！

```bash
npx tsx ./index.ts
```

Parsed Arguments

```
{ args: [], options: { '--': [], type: 'none' } }
```

> 一个小猜想：
>
> cac 就是来解析 command arguments 的

### 其他用法

[一些 demo](./usage.md)

## 看得见的思考

[目录结构](./dict_struct.md)

### 1. 入口

> 下面所有文件未说所在目录，均为 `src` 目录下

根据我们之前的用法

```ts
import cac from 'cac'

const cli = cac() // 可以传入 string 类型参数，该参数将成为此 cac 实例的 name
```

以及 `index.ts` 中得知，我们调用 cac 其实就是创建了一个新的 `CAC` 实例

```ts
// index.ts
import CAC from './CAC'
import Command from './Command'

// 默认导入的 cac 是一个函数，该函数返回一个新的 CAC 实例
const cac = (name = '') => new CAC(name)

export default cac
export { cac, CAC, Command }
```

### 2. 主流程

CAC 此类的作用就是提供常规的方法，比如 `parse`、`command` 等

为什么要继承 EventEmitter 我们先带着疑惑继续看下去：

```ts
class CAC extends EventEmitter {
  // 此 cli 的名称
  name: string
  // 注册的 commands 列表，储存 Command 实例
  commands: Command[]
  // 注册的全局 Command
  globalCommand: GlobalCommand
  matchedCommand?: Command
  matchedCommandName?: string

  // 最原始的 args
  rawArgs: string[]

  // 转换后的 args
  args: ParsedArgv['args']

  // 转换后的 options，这里是 camelCase
  options: ParsedArgv['options']

  showHelpOnExit?: boolean
  showVersionOnExit?: boolean
}
```

#### command

```ts
class CAC {
  /**
   * 添加一个子指令
   */
  command(rawName: string, description?: string, config?: CommandConfig) {
    // 创建一个 command 实例
    const command = new Command(rawName, description || '', config, this)
    // 将当前的全局 command 赋给此实例
    command.globalCommand = this.globalCommand
    // 将此实例添加到 commands 列表中
    this.commands.push(command)
    // 返回 command，实现链式调用
    return command
  }
}
```

#### parse

我们再来看看 `parse` 方法，毕竟有了这个就可以跑起来了

这个方法会非常长，所以我们注意看注释，可以分为几块来看


```ts
class CAC {
  parse(argv = processArgs, { run = true, } = {}): ParsedArgv {
    // 获取 argv
    this.rawArgs = argv
    // 从 argv 中拿到名字
    if (!this.name)
      this.name = argv[1] ? getFileName(argv[1]) : 'cli'

    let shouldParse = true

    // 开始遍历自身储存的 commands
    for (const command of this.commands) {

      // 这里借助另一个函数来解析 argv
      const parsed = this.mri(argv.slice(2), command)

      const commandName = parsed.args[0]
      // 如果找到匹配的 command，那么就关掉 shouldParse
      if (command.isMatched(commandName)) {
        shouldParse = false
        const parsedInfo = {
          ...parsed,
          args: parsed.args.slice(1),
        }
        this.setParsedInfo(parsedInfo, command, commandName)

        // 注意，这里使用的 EventEmitter 中的 emit 方法
        // 触发了一个指令
        // 我们先有一个印象，在将 Command 类的时候，我们来重点讲解一下
        this.emit(`command:${commandName}`, command)
      }
    }

    if (shouldParse) {
      // 如果没有就去走默认指令，即指令名称是  [...xxx]
      for (const command of this.commands) {
        if (command.name === '') {
          shouldParse = false
          const parsed = this.mri(argv.slice(2), command)
          this.setParsedInfo(parsed, command)
          this.emit('command:!', command)
        }
      }
    }

    // 要是还没有找到匹配的呢，那么就最后再通过 mri parse 一遍
    if (shouldParse) {
      const parsed = this.mri(argv.slice(2))
      this.setParsedInfo(parsed)
    }

    if (this.options.help && this.showHelpOnExit) {
      this.outputHelp()
      run = false
      this.unsetMatchedCommand()
    }

    if (this.options.version && this.showVersionOnExit && this.matchedCommandName == null) {
      this.outputVersion()
      run = false
      this.unsetMatchedCommand()
    }

    const parsedArgv = { args: this.args, options: this.options }

    if (run)
      this.runMatchedCommand()

    if (!this.matchedCommand && this.args[0])
      this.emit('command:*')

    return parsedArgv
  }
}
```

总结来说，就是通过解析 `process.argv` 参数

#### process.argv

```bash
node index.js -a --b c d
```

打印出来结果是这样的：

```js
['node absolute path', 'index.js absolute path', '-a', '--b', 'c', 'd']
```

#### mri

mri 是一个解析命令行参数的极简小库，也是 cac 依赖的唯一的一个库

mri 的用法大概是这样的：

```ts
const argv = ['_', 'd:\index.js', 'dev', 'server.ts', '--port', '3000', '--open']
const result = mri(argv.slice(2))
expect(result).toMatchInlineSnapshot(`
    {
      "_": [
        "dev",
        "server.ts",
      ],
      "open": true,
      "port": 3000,
    }
  `)
```

借助 mri 的结果，我们就可以来实现 parse 了

### 3. Command 类

Command 类的主要作用就提供注册 Command 的能力

我们知道 command 其实有 `option` 方法，此方法依赖于 `Option` 类

### 4. Option 类

option 类就是用来储存 option 的 


## 实现

[简版实现](./realize.md)
