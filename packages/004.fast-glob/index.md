<h1 align="center"><samp>fast-glob</samp></h1>

<p align="center"><a href="https://github.com/mrmlnc/fast-glob"><img src="https://img.shields.io/badge/-Github-black.svg" /></a></p>

<p align="center"><samp>It's a very fast and efficient glob library for Node.js</samp></p>

最近在写 fast-glob 的 Rust version `pick-file`，这里就大概放一下 fast-glob 的整体流程和控制系统。

# 串联流程

以 `fg.sync` 为例

```js
const entries = fg.sync(['temp/*.js'])
```

```js
function sync(source, options) {
  assertPatternsInput(source)
  const works = getWorks(source, sync_1.default, options)
  return utils.array.flatten(works)
}
```

## 1. 校验合法性

首先，会对输入的 glob 规则进行校验

```js
function assertPatternsInput(input) {
  const source = [].concat(input)
  const isValidSource = source.every(item => utils.string.isString(item) && !utils.string.isEmpty(item))
  if (!isValidSource)
    throw new TypeError('Patterns must be a string (non empty) or an array of strings')

}
```

这里可以看出来只是做了一下非空和输入类型校验

## 2. 获取任务

```js
const patterns = patternManager.transform([].concat(source))
const settings = new Settings(options)
const tasks = taskManager.generate(patterns, settings)
const provider = new _Provider(settings)
return tasks.map(provider.read, provider)
```

- 转换 `patterns`
- 根据传入的 options 创建 `Settings` 实例
- 通过 `taskManger.generate` 生成任务
- `provider` 读取任务

### 2.1 转换 `patterns`

```js
function transform(patterns) {
  return patterns.map(pattern => removeDuplicateSlashes(pattern))
}
```

删除多余的 slashes

- `foo////a///b` -> `foo/a/b`

### 2.2 创建 `Settings` 实例

```ts
export interface Options {
  absolute?: boolean
  baseNameMatch?: boolean
  braceExpansion?: boolean
  caseSensitiveMatch?: boolean
  concurrency?: number
  cwd?: string
  deep?: number
  dot?: boolean
  extglob?: boolean
  followSymbolicLinks?: boolean
  fs?: Partial<FileSystemAdapter>
  globstar?: boolean
  ignore?: Pattern[]
  markDirectories?: boolean
  objectMode?: boolean
  onlyDirectories?: boolean
  onlyFiles?: boolean
  stats?: boolean
  suppressErrors?: boolean
  throwErrorOnBrokenSymbolicLink?: boolean
  unique?: boolean
}
```

填充对应的数据

### 2.3 生成任务

```js
function generate(patterns, settings) {
  // 1. init positive patterns **/**
  const positivePatterns = getPositivePatterns(patterns)
  // 2. init negative patterns !**/**
  const negativePatterns = getNegativePatternsAsPositive(patterns, settings.ignore)
  // 3. init static patterns
  const staticPatterns = positivePatterns.filter(pattern => utils.pattern.isStaticPattern(pattern, settings))
  // 4. init dynamic patterns
  const dynamicPatterns = positivePatterns.filter(pattern => utils.pattern.isDynamicPattern(pattern, settings))
  // 5. init staticTasks
  const staticTasks = convertPatternsToTasks(staticPatterns, negativePatterns, /* dynamic */ false)
  const dynamicTasks = convertPatternsToTasks(dynamicPatterns, negativePatterns, /* dynamic */ true)
  return staticTasks.concat(dynamicTasks)
}
```

继续 debug，发现这里的 `dynamicPatterns` 是存在的，下一步就看如何生成动态任务了

```js
const dynamicTasks = convertPatternsToTasks(dynamicPatterns, negativePatterns, /* dynamic */ true)
```

只需要看如何初始化静态任务的就行了。

### 2.4 初始化动态任务

```js
// positive: /temp/*.js
// negative:
// dynamic: true
function convertPatternsToTasks(positive, negative, dynamic) {
  const tasks = []
  const patternsOutsideCurrentDirectory = utils.pattern.getPatternsOutsideCurrentDirectory(positive)
  const patternsInsideCurrentDirectory = utils.pattern.getPatternsInsideCurrentDirectory(positive)
  const outsideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsOutsideCurrentDirectory)
  const insideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsInsideCurrentDirectory)
  tasks.push(...convertPatternGroupsToTasks(outsideCurrentDirectoryGroup, negative, dynamic))

  if ('.' in insideCurrentDirectoryGroup)
    tasks.push(convertPatternGroupToTask('.', patternsInsideCurrentDirectory, negative, dynamic))

  else
    tasks.push(...convertPatternGroupsToTasks(insideCurrentDirectoryGroup, negative, dynamic))

  return tasks
}
```

走了几个规则，分为了 `outside` 和 `inside`

- `inside`: `./` or `xxx/`
- `outside`: `../` or `../../`

来看一个核心的数据结构

```js
const obj = {
  temp: ['temp/*.js'],
}
```

把 PatternGroup 转为任务

```js
function convertPatternGroupsToTasks(positive, negative, dynamic) {
  return Object.keys(positive).map((base) => {
    return convertPatternGroupToTask(base, positive[base], negative, dynamic)
  })
}
```

返回数据

```json
{
  "base": "temp",
  "dynamic": true,
  "negative": [],
  "patterns": ["temp/*.js"],
  "positive": ["temp/*.js"]
}
```

以上就是获取到的任务

## 3. provider 处理任务

```js
// 1. 获取根目录
const root = this._getRootDirectory(task)
// 2. 获取 option
const options = this._getReaderOptions(task)
// 3. 开始获取文件 【核心】
const entries = this.api(root, task, options)
return entries.map(options.transform)
```

获取文件，核心就是两个包：

- `@nodelib/fs.walk`
- `@nodelib/fs.stat`

```js
function api(root, task, options) {
  return this._reader.dynamic(root, options)
}
```

```js
function dynamic(root, options) {
  // 就是 fs.walk.walkSync
  return this._walkSync(root, options)
}
```

最后再根据不同的 option 转换规则即可

## 4. walkSync
