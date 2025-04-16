import type { Configuration } from 'electron-builder';
import type { CopySyncOptions } from 'node:fs';

import { cpSync } from 'node:fs';
import path, { dirname } from 'node:path';
import process, { exit, platform } from 'node:process';
import { fileURLToPath } from 'node:url';

import { build, Platform } from 'electron-builder';

// #region 基础配置
// eslint-disable-next-line no-console
const log = console.log;

const version = process.env.VITE_APP_VERSION;
const isDev = process.env.NODE_ENV === 'development';
const appName = isDev ? 'ElectronAppDev' : 'ElectronApp';
const appId = isDev ? 'com.electron.app' : 'com.electron-dev.app';
const shortcutName = isDev ? 'Electron App Dev' : 'Electron App';
const __dirname = dirname(fileURLToPath(import.meta.url));

log('是否是测试环境：', isDev, appName);
log('APP 版本号：', version);
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

cpSync(
  path.join(workDir, '../web/dist'),
  path.join(workDir, './dist/web'),
  copySyncOptions,
);

cpSync(
  path.join(workDir, '../preload/dist'),
  path.join(workDir, './dist/preload'),
  copySyncOptions,
);
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
    main: 'dist/main.cjs',
  },
  directories: {
    output: '../../out',
    buildResources: 'buildResources',
  },
  files: ['dist', 'resources'],
  protocols: {
    name: 'ElectronApp Example',
    schemes: ['electronapp'],
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
  publish: [
    {
      provider: 'github',
      releaseType: 'draft',
      // private: true,
    },
  ],
};
// #endregion

// #region 执行打包
// 要打包的目标平台
const targetPlatform: Platform = {
  darwin: Platform.MAC,
  win32: Platform.WINDOWS,
  linux: Platform.LINUX,
}[platform];

build({
  targets: targetPlatform.createTarget(),
  config: options,
  publish: process.env.CI ? 'always' : 'never',
})
  .then((result) => {
    log(JSON.stringify(result));
    const directories = options.directories || {};
    const outputDir = directories.output || '../../out';
    const outDir = path.join(workDir, outputDir);
    log(`打包完成🎉🎉🎉你要的都在 ${outDir} 目录里🤪🤪🤪`);
  })
  .catch((error) => {
    log('打包失败，错误信息：', error);
    exit(1);
  });
// #endregion
