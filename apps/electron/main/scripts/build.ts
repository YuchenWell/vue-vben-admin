import type { Configuration } from 'electron-builder';
import type { CopySyncOptions } from 'node:fs';

import { cpSync } from 'node:fs';
import path, { dirname } from 'node:path';
import process, { exit, platform } from 'node:process';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';
import { build, Platform } from 'electron-builder';

// #region 基础配置
/** 日志工具 */
const logger = {
  info: (message: string, ...args: any[]) => {
    console.warn(`${chalk.bgBlue(' INFO ')} ${chalk.cyan(message)}`, ...args);
  },
  success: (message: string, ...args: any[]) => {
    console.warn(
      `${chalk.bgGreen(' DONE ')} ${chalk.greenBright(message)}`,
      ...args,
    );
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(
      `${chalk.bgYellow(' WARN ')} ${chalk.yellowBright(message)}`,
      ...args,
    );
  },
  error: (message: string, ...args: any[]) => {
    console.error(
      `${chalk.bgRed(' ERROR ')} ${chalk.redBright(message)}`,
      ...args,
    );
  },
};

const __dirname = dirname(fileURLToPath(import.meta.url));

const version = process.env.VITE_APP_VERSION;
const isDev = process.env.NODE_ENV === 'development';
const appName = isDev ? '运营宝(Dev)' : '运营宝';
const appId = isDev ? 'hcxz.yyb-dev.app' : 'hcxz.yyb.app';
const shortcutName = isDev ? '运营宝(Dev)' : '运营宝';

logger.info(
  `是否是测试环境：${
    isDev ? chalk.yellow('是') : chalk.blue('否')
  }，应用名称：${chalk.bold(appName)}`,
);
logger.info(`APP 版本号：${chalk.bold(version)}`);
// #endregion

// #region 文件复制
const workDir = path.join(__dirname, '../');

const copySyncOptions: CopySyncOptions = {
  recursive: true,
  /**
   * 过滤 source map 文件
   */
  filter: (src) => !src.endsWith('.map') && !src.endsWith('.d.ts'),
};

logger.info('开始复制Web资源...');
cpSync(
  path.join(workDir, '../../web/dist'),
  path.join(workDir, './dist/web'),
  copySyncOptions,
);
logger.success('Web资源复制完成');

logger.info('开始复制Preload资源...');
cpSync(
  path.join(workDir, '../preload/dist'),
  path.join(workDir, './dist/preload'),
  copySyncOptions,
);
logger.success('Preload资源复制完成');
// #endregion

// #region 打包配置
const options: Configuration = {
  appId,
  productName: appName,
  copyright: appName,
  // eslint-disable-next-line no-template-curly-in-string
  artifactName: '${productName}_${arch}_${version}.${ext}',
  asar: true,
  extraMetadata: {
    version,
    name: appName,
    main: 'dist/index.cjs',
  },
  directories: {
    output: '../../../out',
    buildResources: 'buildResources',
  },
  files: ['dist', 'resources'],
  protocols: {
    name: '运营宝',
    schemes: ['yyb'],
  },

  // "store" | "normal" | "maximum". - For testing builds, use 'store' to reduce build time significantly.
  compression: 'normal',
  removePackageScripts: true,

  // afterSign: async (context) => {
  //   await notarizeMac(context)
  // },
  nodeGypRebuild: false,
  buildDependenciesFromSource: false,
  win: {
    icon: 'icon.ico',
    target: [
      {
        target: 'nsis',
        arch: ['ia32', 'x64'],
      },
    ],
  },
  nsis: {
    oneClick: false,
    perMachine: true,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName,
  },

  dmg: {
    sign: true,
  },
  mac: {
    target: [
      {
        target: 'default',
        arch: ['x64', 'arm64'],
      },
    ],
    icon: 'icon.icns',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'buildResources/entitlements.mac.plist',
    entitlementsInherit: 'buildResources/entitlements.mac.plist',
    // identity: "",
    notarize: false,
  },

  linux: {
    desktop: {
      StartupNotify: 'false',
      Encoding: 'utf8',
      MimeType: 'x-scheme-handler/deeplink',
    },
    target: ['AppImage', 'rpm', 'deb'],
  },
  publish: null,
};
// #endregion

// #region 执行打包
// 要打包的目标平台
const targetPlatform: Platform = {
  darwin: Platform.MAC,
  win32: Platform.WINDOWS,
  linux: Platform.LINUX,
}[platform];

logger.info(`开始为 ${chalk.bold(platform)} 平台构建应用...`);

build({
  targets: targetPlatform.createTarget(),
  config: options,
  publish: process.env.CI ? 'always' : 'never',
})
  .then((result) => {
    logger.success('构建过程完成');
    logger.info(`构建结果详情：${chalk.gray(JSON.stringify(result))}`);
    const directories = options.directories || {};
    const outputDir = directories.output || '../../out';
    const outDir = path.join(workDir, outputDir);
    logger.success(`打包完成，输出目录: ${chalk.bold.underline(outDir)}`);
  })
  .catch((error) => {
    logger.error('打包失败，错误信息：');
    console.error(error);
    exit(1);
  });
// #endregion
