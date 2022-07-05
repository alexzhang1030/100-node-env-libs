<h1 align="center"><samp>cac</samp></h1>

<p align="center"><a href="https://github.com/cacjs/cac"><img src="https://img.shields.io/badge/-Github-black.svg" /></a></p>

<p align="center"><samp>Simple yet powerful framework for building command-line apps.</samp></p>

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
{ args: [], options: { '--': [], type: 'index.ts' } }
```

> 一个小猜想：
>
> cac 就是来解析 command arguments 的

### 其他用法

[一些 demo](./usage.md)

## 实现原理

[目录结构](./dict_struct.md)

