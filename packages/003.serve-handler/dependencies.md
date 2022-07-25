# Dependencies

serve-handler 的所有依赖项

- `bytes`: 将表示为字符串的字节转为字节（例如 `1kb` -> `1024`）也可以相互转换
- `content-disposition`: 创建和转换 http `Content-Disposition` 头
- `fast-url-parser`: url 解析器
- `mime-types`: 根据文件后缀获取 mime 类型
- `minimatch`: glob 匹配器
- `path-is-inside`: 测试一个路径是否在另一个路径里面
- `path-to-regexp`: 将路径字符串 (如 `/user/: name`) 转换为正则表达式。
- `range-parser`: range 头字段解析器
