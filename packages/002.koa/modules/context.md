# Context

Context 的核心

这里需要提一嘴，为什么 context 是这么写的：

```js
const proto = module.exports = {
  // ...
}
```

主要原因是在 `application` 中需要直接创建一个 `Context` 为原型的对象

然后用 `delegate` 这个库为它的方法做了一些代理

在 Context 中提供了一些常用的方法，例如：

- `throw`: 抛出一个错误
- `toJSON`
- `assert`: 和 `throw` 行为差不多，只是添加了断言