# editorconfig

跨编辑器/IDE 规范编码风格，使用 yaml 风格，配置文件为 `.editorconfig` 

[官网](https://editorconfig.org/) 

注意在 VSCode 中需要下载一个插件，用于支持  `editorconfigCore`

一个规范的 `.editorconfig` 通常是这样的：

```yaml
root = true

[*]
charset = utf-8
indent_size = 2
indent_style = space
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
insert_final_newline = false
trim_trailing_whitespace = false
```