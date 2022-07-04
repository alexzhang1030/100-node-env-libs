## cac demo

### 展示 help message

```ts
cli.option('--name <name>', 'Provide your name')

// 通过 -h 和 --help 来显示帮助信息，这会展示所有的指令，如这里设定了 name
cli.help()

// 通过 -v 或 --version 展示版本信息，版本信息同样会在 help message 中出现
cli.version('0.0.0')

// 必须执行这一条
cli.parse()
```

### 特定于指令的选项

```ts
cli
  .command('rm <dir>', 'Remove a dir')
  .option('-r, --recursive', 'Remove recursively')
  .action((dir, options) => {
    console.log(`remove ${dir}${options.recursive ? ' recursively' : ''}`)
  })

cli.help()
cli.parse()
```

可以使用 `npx tsx index.ts rm foo -r` 来看看效果

所以可以通过链式调用来为某个 `command` 指定特定的选项

### 引用选项

如果在 action 中需要引用选项的名称，应该使用 `camelCase` 来引用 `kebab-case` 的选项

```ts
cli.command('dev', 'start dev server')
  .option('--clear-screen', 'clear command screen')
  .action((options) => {
    // camelCase 引用 kebab-case 的选项
    console.log(options.clearScreen)
  })

cli.parse()
```

### 括号

在 command 名称中，cac 支持 `[]` 方括号和 `<>` 尖括号两种形式：

在命令名中：

- **方括号**：表示可选值
- **尖括号**：表示必须值

在选项值中：

- **尖括号**：string 或者 number
- **方括号**：true

```ts
// 这里的 folder 是必选值，下面的 options 的 level 是数字或者 string
cli.command('deploy <folder>', 'Deploy a folder to serve')
  .option('--scale [level]', 'Scaling level')
  .action((folder, options) => {
    console.log({ folder, options })
  })
```

### 否定值

为了支持否定值，需要显示声明否定值的情况

```ts
// 注意，如果存在 --config，那么否定值必须是 no-xxx
cli.command('dev <project>', 'Start DevServer')
  .option('--no-config', 'disabled config')
  .option('--config <path>', 'Use a custom path')
  .action((project, options) => {
    console.log({ project, options })
  })
```

### 可变参数

命令的最后一个参数可以是可变的（必须是最后一个参数）

创建一个可变参数就是在中括号值的最开头加上 `...`

```ts
cli.command('dev <project> [...otherFiles]', 'Start DevServer')
  .action((project, otherFiles, options) => {
    console.log({ project, otherFiles, options })
  })
```

若输入 `dev d g f`

那么 `project` 是 `d`，`otherFiles` 是 `[g, f]`

### 对象形式的指令

cac 还可以接收对象形式的指令，最终表现形式是 `.` 组合

```ts
// build --env.bar baz --env.foo foo2
// console this: { '--': [], env: { bar: 'baz', foo: 'foo2' } }
cli.command('build', 'desc')
  .option('--env <env>', 'set env')
  .action((options) => {
    console.log({ options })
  })
```

### 默认的 command

注册一个指令，如果没有触发任何指令，那么这个默认指令就会被触发

```ts
// a b c --mini
// { files: [ 'a', 'b', 'c' ], options: { '--': [], mini: true } }
cli.command('[...files]', 'sample')
  .option('--mini', 'Minimize output')
  .action((files, options) => {
    console.log({ files, options })
  })
```

### 给定一个数组值

```bash
node cli.js --include project-a
# The parsed options will be:
# { include: 'project-a' }

node cli.js --include project-a --include project-b
# The parsed options will be:
# { include: ['project-a', 'project-b'] }
```

### 错误处理

全局处理错误值

```ts
try {
  // 只 parse 不运行
  cli.parse(process.argv, { run: false })
  // 使用这个指令手动运行
  await cli.runMatchedCommand()
}
catch (error) {
  // Handle error here..
  // e.g.
  // console.error(error.stack)
  // process.exit(1)
}
```
