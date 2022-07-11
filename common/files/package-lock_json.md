# package-lock.json

这个文件用于追踪每个软件包的确切版本，我们知道在 `packages.json` 中的依赖版本采用 `semver` 的形式来存放，但是在安装时会根据此语义化版本来安装最新版：

```
# 例如 packages.json 中的版本为 `~0.13.0`

那么实际安装会是 `0.13.xx` 这里的 xx 是最新版，但是不会安装 `0.14.xx`
```

这种看似是好的，但是不同的小版本之间可能会存在差异，那么不同开发者协作就会出现问题。

那么 package-lock.json 就是为了解决这个问题，它细化了每个依赖的版本，当安装依赖时，会根据这个 lock 文件安装具体版本的依赖。


- [官方文档](http://nodejs.cn/learn/the-package-lock-json-file)