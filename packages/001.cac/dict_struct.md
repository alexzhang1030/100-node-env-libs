## cac 目录结构详解

```
cac
├─ .editorconfig
├─ .gitattributes
├─ .github
│    ├─ FUNDING.yml
│    └─ ISSUE_TEMPLATE.md
├─ .gitignore
├─ .prettierrc
├─ LICENSE
├─ README.md
├─ circle.yml
├─ examples
├─ index-compat.js
├─ jest.config.js
├─ mod.js
├─ mod.ts
├─ mod_test.ts
├─ package.json
├─ rollup.config.js
├─ scripts
│    └─ build-deno.ts
├─ src
│    ├─ CAC.ts
│    ├─ Command.ts
│    ├─ Option.ts
│    ├─ __test__
│    ├─ deno.ts
│    ├─ index.ts
│    ├─ node.ts
│    └─ utils.ts
├─ tsconfig.json
└─ yarn.lock
```

- [`.editorconfig`](../../common/files/editorconfig.md)
- [`.gitattributes`](../../common/files/gitattributes.md)
- .github: github 配置文件
  - `FUNDING.yml`: github 赞助配置文件
  - `ISSUE_TEMPLATE.yaml`: github yaml 模板配置文件
- [`.gitignore`](../../common/files/gitignore.md)
- [`.prettierrc`](../../common/files/prettierrc.md)
- [`LICENSE`](../../common/files/license.md)
- README：项目介绍文件
- circle.yaml: CircleCI 的配置文件
- examples: 示例
- index.compat.js: 主入口，主要是为了兼容 cjs
- jest.config.js: jest 配置文件
- mod.\*: 兼容 deno
- [`package.json`](../../common/files/package_json.md)
- rollup.config.js: rollup 配置文件（主要是打包用的）
- tsconfig.json: TS 配置文件
- scripts: 项目中用到的脚本
- src: 项目主目录
- yarn.lock: yarn 的依赖锁文件
