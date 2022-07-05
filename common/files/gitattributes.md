# gitattributes

当执行 git 动作时，.gitattributes 文件允许你指定由 git 使用的文件和路径的属性，例如：git commit 等。

比较常用的有 `eol`(end of line) 属性，主要原因在于 Windows 和 Unix like 的文件结尾行不同

- windows 是 `CRLF`(Carriage Return Line Feed) 回车换行
- 但在 unix like 系统中，使用 `LF`(Line Feed) 换行

由于换行符不同，不同操作平台之间的开发者很容易导致 Git 提交的文件不一致(可能会从 LF 改为 CRLF 或者反之)，所以 gitattributes 就可以排上用场了：

一个规范的 `.gitattributes` 的文件可能是这样的：

```
*.js  eol=lf
*.jsx eol=lf
*.ts  eol=lf
*.tsx eol=lf
```

如果希望工作区的所有文本都是规范化的，可以采用

```
* text=auto
*.js text eol=lf
*.ts text eol=crlf
*.sh -text
```

在上面的配置文件中规范：

- 所有文件是 `auto`
- `.js` 是 `lf`
- `.ts` 是 `crlf`
- `.sh` 不进行格式化

## 引用

- [详解](https://www.cnblogs.com/kidsitcn/p/4769344.html)