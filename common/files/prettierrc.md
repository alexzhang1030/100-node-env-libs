# prettierrc

prettier 的配置文件

通常的表现形式有：

- `package.json` 中配置 `prettier` 字段
- 用 JSON 或者 yaml 写 `.prettierrc` 文件
- 一个 `.prettierrc.json`、`.prettierrc.yaml`、`.prettierrc.yml`、`.prettierrc.json5` 文件
- 一个 `.prettierrc.js`、`.prettierrc.cjs`、`prettier.config.js`、`prettier.config.cjs` 文件用 `module.exports` 导出
- 一个 `.prettierrc.toml` 文件


## 例子

一个 `.prettierrc` 文件示例(使用 json 编写)

```json
{
  "trailingComma": "es5",
  "tabWidth": 4,
  "semi": false,
  "singleQuote": true
}
```