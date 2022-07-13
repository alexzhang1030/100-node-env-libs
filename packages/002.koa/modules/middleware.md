# 中间件处理流程

koa 最著名的洋葱模型，其处理流程已经抽离出来作为单独的库 `koa-compose`。

在 Koa 本体中，`use` 只是接收一个 callback，并将其放置在 `middleware` 中。

在启动服务时，通过 `koa-compose` 中的 `compose` 函数，将 `middleware` 中的所有中间件组合成一个函数。

以下是 `koa-compose` 中的核心逻辑：

```js
function compose(middleware) {
  // 首先， middleware 必须要是一个数组
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  // 然后，这个数组中必须要存放函数
  for (const fn of middleware)
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')

  return function (context, next) {
    let index = -1
    return dispatch(0)
    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      }
      catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

所谓洋葱模型，就是按照顺序调用了每一个 `middleware` 函数，在 `next` 函数中，我们可以通过 `dispatch(i + 1)` 来调用下一个 `middleware` 函数。

由于它使用了 `Promise` 进行 resolve 和 reject，因此 Koa 中的函数都可以是异步的。