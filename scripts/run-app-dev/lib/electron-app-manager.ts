import type { ChildProcess } from 'node:child_process';

import { spawn } from 'node:child_process';

import electronPath from 'electron';

/**
 * Electron 应用管理器
 * 负责启动、停止和管理 Electron 进程
 */
export class ElectronAppManager {
  private app: ChildProcess | null = null;
  private log = console.log;

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

    this.log('正在启动 Electron 应用...');

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
      this.log(data.toString());
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
