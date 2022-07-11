# 认识 Koa

Koa 是一个基于 `Node.js` 标准库 `http` 封装的 HTTP 服务框架。可以根据此框架使用 JavaScript 编写 API 服务。

我们来看看如何使用：

```ts
import Koa from 'koa'

const app = Koa()

// response
app.use((ctx) => {
  ctx.body = 'hello koa'
})

app.listen(3000)
```

```bash
# 访问 0.0.0.0:3000 查看结果
node ./your-file.js
```

## 中间件

我们都知道 Koa 最著名的就是 ** 洋葱模型 **，它的操作时根据一层一层的 `middleware` 穿透的，可以才被称为洋葱模型。

有两种不同形式的中间件：

- `async` 函数
- 普通函数


一个异步中间件是这样的：

```js
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
```


一个普通的中间件是这样的：


```js
// 中间件一般有两个参数 (ctx, next)
// ctx: 请求的上下文
// next: 是一个函数，用于执行下方的中间件，他返回一个 Promise

app.use((ctx, next) => {
  const start = Date.now()
  return next().then(() => {
    const ms = Date.now() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  })
})
```

## 上下文，请求和响应

每一个中间件都接收一个 `Context` 对象，这个对象封装了 http 请求和响应的信息。一般 `ctx` 无特殊说明指的即是 `Context` 对象

```js
app.use(async (ctx, next) => await next())
```

在 `Context` 中有一个属性 `request`，封装了 http 请求的相关信息。

同时也有一个属性 `response` 来封装 http 响应的相关信息。

可以在 [API Documentation](https://github.com/koajs/koa/blob/master/docs/api/index.md) 查看 Koa 的 API 文档