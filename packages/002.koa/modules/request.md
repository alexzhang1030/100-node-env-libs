# Request

Request 核心

提供了一些实用方法，一般我们是这样用的：

```js
app.use((ctx, next) => {
  ctx.request.xxx
})
```