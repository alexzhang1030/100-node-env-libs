# ESLint 配置文件

用于配置 ESLint 规则的配置文件

通常的表现形式有：

- `package.json` 中配置 `eslintConfig` 字段
- 使用 `json`、`javascript`、`yaml` 编写的 `.eslintrc.*` 文件

有很多信息可以配置：

- Environments - 指定脚本的运行环境。每种环境都有一组特定的预定义全局变量。
- Globals - 脚本在执行期间访问的额外的全局变量。
- Rules - 启用的规则及其各自的错误级别。


## 例子

一个 `.eslintrc` 文件示例(使用 json 编写)

```json
{
  "extends": "@alexzzz",
  "rules": {
    // ...
  }
}
```