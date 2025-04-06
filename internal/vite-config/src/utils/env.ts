import type { ApplicationPluginOptions } from '../typing';

import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { fs } from '@vben/node-utils';

import dotenv from 'dotenv';

const getBoolean = (value: string | undefined) => value === 'true';

const getString = (value: string | undefined, fallback: string) =>
  value ?? fallback;

const getNumber = (value: string | undefined, fallback: number) =>
  Number(value) || fallback;

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
  const script = process.env.npm_lifecycle_script as string;
  const reg = /--mode ([\d_a-z]+)/;
  const result = reg.exec(script);

  let mode = 'production';
  if (result) {
    mode = result[1] as string;
  }
  return ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`];
}

/**
 * Get the environment variables starting with the specified prefix
 * @param match prefix
 * @param confFiles ext
 */
async function loadEnv<T = Record<string, string>>(
  match = 'VITE_GLOB_',
  confFiles = getConfFiles(),
  root = process.cwd(),
) {
  let envConfig = {};

  for (const confFile of confFiles) {
    try {
      const confFilePath = join(root, confFile);
      if (existsSync(confFilePath)) {
        const envPath = await fs.readFile(confFilePath, {
          encoding: 'utf8',
        });
        const env = dotenv.parse(envPath);
        envConfig = { ...envConfig, ...env };
      }
    } catch (error) {
      console.error(`Error while parsing ${confFile}`, error);
    }
  }
  const reg = new RegExp(`^(${match})`);
  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key);
    }
  });
  return envConfig as T;
}

async function loadAndConvertEnv(
  options: {
    confFiles?: string[];
    match?: string;
    root?: string;
  } = {},
): Promise<
  Partial<ApplicationPluginOptions> & {
    appTitle: string;
    base: string;
    port: number;
  }
> {
  const {
    confFiles = getConfFiles(),
    match = 'VITE_GLOB_',
    root = process.cwd(),
  } = options;

  const envConfig = await loadEnv(match, confFiles, root);

  const {
    VITE_APP_TITLE,
    VITE_ARCHIVER,
    VITE_BASE,
    VITE_COMPRESS,
    VITE_DEVTOOLS,
    VITE_INJECT_APP_LOADING,
    VITE_PORT,
    VITE_PWA,
    VITE_VISUALIZER,
  } = envConfig;

  const compressTypes = (VITE_COMPRESS ?? '')
    .split(',')
    .filter((item) => item === 'brotli' || item === 'gzip');

  return {
    appTitle: getString(VITE_APP_TITLE, 'Vben Admin'),
    archiver: getBoolean(VITE_ARCHIVER),
    base: getString(VITE_BASE, '/'),
    compress: compressTypes.length > 0,
    compressTypes,
    devtools: getBoolean(VITE_DEVTOOLS),
    injectAppLoading: getBoolean(VITE_INJECT_APP_LOADING),
    port: getNumber(VITE_PORT, 5666),
    pwa: getBoolean(VITE_PWA),
    visualizer: getBoolean(VITE_VISUALIZER),
  };
}

export { loadAndConvertEnv, loadEnv };
