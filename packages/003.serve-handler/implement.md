# 源码解析

## 主流程

![main-process](./images/main-process.png)

### 一些关键处理流程

可以看 [index.test.ts](./__test__/index.test.ts) 来查看完整的测试样例
可以看 [src](./src/) 来看完整的实现

#### 启动

核心代码可以直接浓缩为以下几行：

```ts
const cwd = getCurrentWorkDir()
// 根据 request.url 来找文件
const path = resolve(cwd, request.url!.slice(1))
// 文件不存在，走 404 处理
if (!existsSync(path))
  processError(404, response)
// 文件存在，那么直接走文件处理流程
else
  createReadStream(path).pipe(response)
```

#### redirect
