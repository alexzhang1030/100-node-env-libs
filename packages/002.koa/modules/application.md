# Application

Application 这个类就是入口。

一个 Koa 程序有以下的方法：

## 方法

### Listen

通过 Node 标准库来创建一个服务

```js
class {
  listen(...args) {
    debug('listen')
    // 通过标准库创建一个服务, 注意调用了 callback 函数
    const server = http.createServer(this.callback())
    return server.listen(...args)
  }
}
```

### use

中间件处理函数

```js
class {
  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!')
    debug('use %s', fn._name || fn.name || '-')
    // 挂载一个中间件
    this.middleware.push(fn)
    return this
  }
}
```

### callback

目前来看，callback 主要是将所有的中间件组合，作为创建服务时的回调

```js
class {
  // 返回的函数将会作为处理 http 请求的回调
  callback() {
    const fn = this.compose(this.middleware)

    if (!this.listenerCount('error')) this.on('error', this.onerror)

    const handleRequest = (req, res) => {
      // 创建上下文
      const ctx = this.createContext(req, res)
      // 返回 `handleRequest` 函数
      return this.handleRequest(ctx, fn)
    }

    return handleRequest
  }
}
```

### handleRequest

处理请求的主要函数

```js
class {
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res
    res.statusCode = 404
    const onerror = err => ctx.onerror(err)
    const handleResponse = () => respond(ctx)
    onFinished(res, onerror)
    // 先执行中间件，然后执行处理 response 的函数
    return fnMiddleware(ctx).then(handleResponse).catch(onerror)
  }
}
```

### createContext

那么这个类的主要作用就是初始化数据

```js
class {
  createContext(req, res) {
    // 创建一个空对象，原型指向上下文
    const context = Object.create(this.context)
    // 创建数据
    const request = context.request = Object.create(this.request)
    const response = context.response = Object.create(this.response)
    context.app = request.app = response.app = this
    context.req = request.req = response.req = req
    context.res = request.res = response.res = res
    request.ctx = response.ctx = context
    request.response = response
    response.request = request
    context.originalUrl = request.originalUrl = req.url
    context.state = {}
    return context
  }
}
```

### respond

这个函数用于处理 response

```js
function respond(ctx) {
  // allow bypassing koa
  if (ctx.respond === false) return

  if (!ctx.writable) return

  const res = ctx.res
  let body = ctx.body
  const code = ctx.status

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null
    return res.end()
  }

  if (ctx.method === 'HEAD') {
    if (!res.headersSent && !ctx.response.has('Content-Length')) {
      const { length } = ctx.response
      if (Number.isInteger(length)) ctx.length = length
    }
    return res.end()
  }

  // status body
  if (body == null) {
    if (ctx.response._explicitNullBody) {
      ctx.response.remove('Content-Type')
      ctx.response.remove('Transfer-Encoding')
      ctx.length = 0
      return res.end()
    }
    if (ctx.req.httpVersionMajor >= 2)
      body = String(code)
    else
      body = ctx.message || String(code)

    if (!res.headersSent) {
      ctx.type = 'text'
      ctx.length = Buffer.byteLength(body)
    }
    return res.end(body)
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body)
  if (typeof body === 'string') return res.end(body)
  if (body instanceof Stream) return body.pipe(res)

  // body: json
  body = JSON.stringify(body)
  if (!res.headersSent)
    ctx.length = Buffer.byteLength(body)

  res.end(body)
}
```