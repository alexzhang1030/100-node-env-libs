# Koa 依赖的库

```json
{
  "dependencies": {
    "accepts": "^1.3.5",
    "cache-content-type": "^1.0.0",
    "content-disposition": "~0.5.2",
    "content-type": "^1.0.4",
    "cookies": "~0.8.0",
    "debug": "^4.3.2",
    "delegates": "^1.0.0",
    "destroy": "^1.0.4",
    "encodeurl": "^1.0.2",
    "escape-html": "^1.0.3",
    "fresh": "~0.5.2",
    "http-assert": "^1.3.0",
    "http-errors": "^1.6.3",
    "koa-compose": "^4.1.0",
    "on-finished": "^2.3.0",
    "only": "~0.0.2",
    "parseurl": "^1.3.2",
    "statuses": "^1.5.0",
    "type-is": "^1.6.16",
    "vary": "^1.1.2"
  }
}
```

- `accepts`: 可接收文件内容判断，提取于 `koa`
- `cache-content-type`: 缓存了 Content-Type
- `content-disposition`: 创建和解析 http 的 `Content-Disposition` 字段
- `content-type`: 创建和解析 `Content-Type` 字段
- `cookies`: 为 cookie 提供支持
- `debug`: 模仿 Node.js 核心调试技术的小型 JavaScript 调试工具
- `delegates`: Node 方法和访问器委托
- `destroy`: 确保一个文件流被销毁
- `encodeurl`: 编码和解码 url
- `escape-html`: HTML 转义
- `fresh`: 检测请求头和响应头的字段是否是最新的
- `http-assert`: http-code 断言
- `http-errors`: 创建 HTTP 错误对象
- `koa-compose`: 组合 koa 中的中间件
- `on-finished`: 当一个 http 请求完成、关闭、错误时执行回调
- `only`: 返回给定对象中的白名单属性（即非 `_` 开头的属性）
- `parseurl`: 解析 url
- `statuses`: Node http 状态码工具
- `type-is`: 推断 http 请求的内容类型
- `vary`: 操作 http `vary` 字段