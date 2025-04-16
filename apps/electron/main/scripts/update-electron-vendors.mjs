/**
 * 该脚本用于在Electron上下文中更新浏览器兼容性配置
 * 读取当前Electron环境的Node和Chrome版本，并更新相关配置文件
 */

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

/**
 * 更新Electron供应商缓存和浏览器列表配置
 */
function updateElectronVendors() {
  try {
    // 获取当前Electron环境的版本信息
    const electronRelease = process.versions;

    // 提取主要版本号
    const nodeVersion = electronRelease.node.split('.')[0];
    const chromeVersion = electronRelease.v8.split('.').splice(0, 2).join('');

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

    // 写入版本缓存文件
    writeFileSync(
      cacheFilePath,
      JSON.stringify({ chrome: chromeVersion, node: nodeVersion }),
    );

    // 更新浏览器兼容性配置
    writeFileSync(browserslistrcPath, `Chrome ${chromeVersion}`, 'utf8');
  } catch (error) {
    console.error('❌ 更新Electron vendors失败:', error.message);
    throw new Error(`更新Electron vendors失败: ${error.message}`);
  }
}

// 执行更新
updateElectronVendors();
