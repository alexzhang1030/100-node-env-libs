# Usage

serve-handler 的作用就是托管静态资源。其作用和 nginx 类似。

我们可以先看一个例子：

```ts
import { createServer } from 'http'
import handler from 'serve-handler'

createServer(async (req, res) => {
  await handler(req, res)
}).listen(5173, () => {
  // eslint-disable-next-line no-console
  console.log('listening on port 5173')
})
```

然后，我们来启动它：

```bash
tsx ./index.ts
```

接下来，我们就可以看到一个静态服务器了。

## 特性

`serve-handler` 支持以下特性：

- `public`: 资源的根目录
- `cleanUrls`: 去除 html 的后缀
- `rewrites`: 路径重写
- `redirects`: 资源的重定向
- `headers`: 为指定路径设置自定义的响应头
- `directoryListing`: 禁用目录展示为列表
- `unlisted`: 排除路径
- `trailingSlash`: 删除或添加尾部斜杠
- `renderSingle`: 如果路径只存在一个文件，那么直接渲染
- `symlinks`: 解析符号链接而不是 404 错误
- `etag`: 计算一个强大的 `ETag` 响应头，而不是 `Last-Modified`

## public

默认情况下，直接托管根路径，但是很多时候，我们需要自定义个一个托管的路径。

```ts
await handler(req, res, {
  // /_site 是根路径
  public: '/_site'
})
```

## cleanUrls

默认情况下 `.html` 后缀在 URL 中存在，那么如果想要去除，就可以使用 cleanUrls。

```ts
await handler(req, res, {
  // 可以设置为 boolean，这样就直接去除所有目录的
  cleanUrls: true,
  // 也可以单独为某些路径设置
  cleanUrls: [
    '/about/**',
    '/!components/**'
  ]
})
```

## rewrites

重写某些资源的路径

```ts
await handler(req, res, {
  rewrites: [
    {
      source: 'app/**',
      destination: '/index.html'
    },
    // 也可以设置所谓的 "路由段"
    {
      source: 'app/:id/edit',
      destination: '/edit-project-:id.html'
    }
  ]
})
```

## redirects

重定向某些资源的路径，默认是 301，也可以通过设置 type 来改变为 302。

```ts
await handler(req, res, {
  redirects: [
    {
      source: '/from',
      destination: '/to',
    },
    {
      source: '/old-docs/:id',
      destination: '/new-docs/:id',
      type: 302
    }
  ]
})
```

## headers

为某些资源设置自定义的响应头

```ts
await handler(req, res, {
  headers: [
    {
      source: '**/*.@(jpg|png|gif)',
      headers: [{
        key: 'Cache-Control',
        value: 'max-age=7200'
      }]
    }
  ]
})
```

## directoryListing

如果某个路径是一个文件夹，那么默认会渲染一个 list，如果想要禁用这个功能，就可以使用 directoryListing。

```ts
await handler(req, res, {
  directoryListing: [
    '/assets/**',
    '/!assets/private'
  ]
})
```

## unlisted

排除某些路径

```ts
await handler(req, res, {
  unlisted: [
    '.DS_Store',
    '.git'
  ]
})
```

## trailingSlash

添加或删除尾部斜杠

```ts
await handler(req, res, {
  trailingSlash: true
})
```

这样的话，`/test` 会被 301 重定向到 `/test/`

## renderSingle

如果某个路径下只有一个文件，那么直接渲染这个文件

```ts
await handler(req, res, {
  renderSingle: true
})
```

## symlinks

解析符号链接而不是 404 错误

```ts
await handler(req, res, {
  symlinks: true
})
```

## etag

计算一个强大的 `ETag` 响应头，而不是 `Last-Modified`

```ts
await handler(req, res, {
  etag: true
})
```

## 错误码的模板

添加 `<status-code>.html` 在根目录来指定某个错误码的模板。

## 中间件

第四个参数可以接收一个对象，这个对象可以包含一个或多个中间件。

函数应是异步的

```ts
await handler(request, response, undefined, {
  lstat(path) {},
  realpath(path) {},
  createReadStream(path, config) {},
  readdir(path) {},
  sendError(absolutePath, response, acceptsJSON, root, handlers, config, error) {}
})
```

需要注意一点：像是 `createReadStream` 这种原生方法，将会把所有的参数直接传给原生方法
