/**
 * 该脚本用于在Electron上下文中更新浏览器兼容性配置
 * 读取当前Electron环境的Node和Chrome版本，并更新相关配置文件
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path, { dirname } from 'node:path';
import process from 'node:process';

import chalk from 'chalk';
import { format } from 'prettier';

const logger = console;

/**
 * 安全地写入文件（确保目录存在）
 */
function safeWriteFileSync(filePath, content, encoding = 'utf8') {
  const dir = dirname(filePath);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(filePath, content, encoding);
  logger.info(`文件已更新: ${chalk.bold(filePath)}`);
}

/**
 * 更新Electron供应商缓存和浏览器列表配置
 */
async function updateElectronVendors() {
  try {
    // 获取当前Electron环境的版本信息
    const electronRelease = process.versions;

    // 提取主要版本号
    const nodeVersion = electronRelease.node.split('.')[0];
    const chromeVersion = electronRelease.v8.split('.').splice(0, 2).join('');

    logger.log(
      `检测到Node版本: ${chalk.bold(nodeVersion)}, Chrome版本: ${chalk.bold(chromeVersion)}`,
    );

    // 定义目标文件路径
    const cacheFilePath = path.resolve(
      process.cwd(),
      '.electron-vendors.cache.json',
    );
    const browserslistrcPath = path.resolve(
      process.cwd(),
      '../../web',
      '.browserslistrc',
    );

    const content = await format(
      JSON.stringify({ chrome: chromeVersion, node: nodeVersion }, null, 2),
      { parser: 'json' },
    );

    // 写入版本缓存文件
    safeWriteFileSync(cacheFilePath, content);

    // 更新浏览器兼容性配置
    safeWriteFileSync(browserslistrcPath, `Chrome ${chromeVersion}`);

    logger.log('Electron vendors 更新完成');
    return true;
  } catch (error) {
    logger.error(`更新Electron vendors失败: ${error.message}`);
    return false;
  }
}

updateElectronVendors();
