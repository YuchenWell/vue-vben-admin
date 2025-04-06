#!/usr/bin/env node

import type { ChildProcess } from 'node:child_process';
import type { LogLevel, ViteDevServer } from 'vite';

import { spawn } from 'node:child_process';
import path from 'node:path';

import electronPath from 'electron';
import minimist from 'minimist';
import { build, createServer } from 'vite';

type Mode = 'development' | 'production';

const log = console.log;

const parsedArgs = minimist(process.argv.slice(2), {
  boolean: ['watch'],
  default: {
    mode: 'development',
    watch: false,
  },
  string: ['mode'],
});

// 验证 mode 参数
if (parsedArgs.mode !== 'development' && parsedArgs.mode !== 'production') {
  console.error(`错误: mode 必须是 'development' 或 'production'`);
  process.exit(1);
}

const mode = (process.env.MODE = process.env.MODE || parsedArgs.mode) as Mode;
const logLevel: LogLevel = 'warn';

class ElectronAppManager {
  private app: ChildProcess | null = null;

  /**
   * 关闭现有的 Electron 进程
   */
  public killExisting(): void {
    if (this.app !== null) {
      this.app.removeListener('exit', process.exit);
      this.app.kill('SIGINT');
      this.app = null;
    }
  }

  /**
   * 启动 Electron 进程
   * @param workingDir 工作目录
   */
  public launch(workingDir: string): void {
    this.killExisting();

    log('正在启动 Electron 应用...');

    this.app = spawn(String(electronPath), ['--inspect', '.'], {
      cwd: workingDir,
    });

    this.setupLogging();
    this.setupExitHandler();
  }

  /**
   * 设置退出处理
   */
  private setupExitHandler(): void {
    if (!this.app) return;
    this.app.addListener('exit', process.exit);
  }

  /**
   * 设置日志
   */
  private setupLogging(): void {
    if (!this.app) return;

    this.app.stdout?.on('data', (data) => {
      log(data.toString());
    });

    this.app.stderr?.on('data', (data) => {
      const str = data.toString();
      const ignoreErrors = [
        'Secure coding is not enabled for restorable state',
        'CoreText note: Client requested name',
      ];

      if (!ignoreErrors.some((err) => str.includes(err))) {
        console.error(str);
      }
    });
  }
}

// 创建 Electron 应用管理器实例
const electronAppManager = new ElectronAppManager();

const setupMainPackageWatcher = ({ resolvedUrls }: ViteDevServer) => {
  process.env.VITE_DEV_SERVER_URL = resolvedUrls?.local[0];

  return build({
    build: {
      watch: parsedArgs.watch ? {} : null,
    },
    configFile: 'apps/electron/main/vite.config.ts',
    logLevel,
    mode,
    plugins: [
      {
        name: 'reload-app-on-main-package-change',
        writeBundle() {
          electronAppManager.launch(
            path.resolve(process.cwd(), './apps/electron/main'),
          );
        },
      },
    ],
  });
};

const setupPreloadPackageWatcher = ({ ws }: ViteDevServer) => {
  return build({
    build: {
      watch: {},
    },
    configFile: 'apps/electron/preload/vite.config.ts',
    logLevel,
    mode,
    plugins: [
      {
        name: 'reload-page-on-preload-package-change',
        writeBundle() {
          ws.send({
            type: 'full-reload',
          });

          console.warn('Preload 包已更新，正在重新加载页面');
        },
      },
    ],
  });
};

async function main() {
  try {
    log('正在启动开发服务器...');

    const rendererDevServer = await createServer({
      configFile: 'apps/web/vite.config.mts',
      logLevel,
      mode,
    });

    const rendererWatchServer = await rendererDevServer.listen();

    log('开发服务器启动成功');

    await setupPreloadPackageWatcher(rendererWatchServer);
    await setupMainPackageWatcher(rendererWatchServer);
  } catch (error) {
    console.error('启动失败:', error);
    process.exit(1);
  }
}

process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('未处理的 Promise 拒绝:', reason);
});

// 启动应用
main();
