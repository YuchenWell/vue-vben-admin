# 开发服务器脚本

该目录包含用于启动 Electron 应用开发环境的脚本。

## 文件结构

```
scripts/run-app-dev/
├── index.ts            # 主入口文件
├── lib/
│   ├── config.ts            # 配置和命令行参数处理
│   ├── types.ts             # 类型定义
│   ├── electron-app-manager.ts  # Electron 应用管理
│   └── watchers/
│       ├── main-package.ts  # Main 包监视器
│       └── preload-package.ts  # Preload 包监视器
└── README.md                # 本文档
```

## 使用方法

在项目根目录执行以下命令启动开发环境:

```bash
pnpm dev:app
```

可选参数:

- `--mode`: 开发模式，可选 `development` 或 `production`，默认为 `development`
- `--watch`: 是否监视文件变化，默认为 `false`

示例:

```bash
pnpm dev:app --mode development --watch
```

## 功能说明

1. **开发服务器管理**: 启动和管理 Vite 开发服务器
2. **Electron 应用管理**: 启动、重启和管理 Electron 进程
3. **文件监视**:
   - 监视 main 包文件变化，自动重启 Electron 应用
   - 监视 preload 包文件变化，自动重新加载页面
