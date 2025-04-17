import type { AfterPackContext } from 'electron-builder';

import { env } from 'node:process';

import { logger } from '@vben/node-utils';

import { notarize } from '@electron/notarize';

/**
 * macOS应用程序签名流程
 * 验证签名是否成功: codesign -dv --verbose=4 /path/to/your/file.dmg
 * @see https://github.com/electron/notarize
 */
export async function notarizeMac(context: AfterPackContext) {
  const { electronPlatformName, appOutDir } = context;

  // 仅对Mac平台进行处理
  if (electronPlatformName !== 'darwin') {
    logger.info('跳过非macOS平台的公证步骤');
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;

  // 检查必要的环境变量
  const appleId = env.APPLE_ID;
  const applePassword = env.APPLE_PASSWORD;
  const teamId = env.APPLE_TEAM_ID;

  if (!appleId || !applePassword || !teamId) {
    logger.error(
      '缺少必要的环境变量: APPLE_ID, APPLE_PASSWORD 或 APPLE_TEAM_ID',
    );
    throw new Error('macOS应用公证所需的环境变量缺失');
  }

  try {
    logger.info(`开始公证应用: ${appPath}`);

    await notarize({
      appPath,
      tool: 'notarytool',
      appleId,
      appleIdPassword: applePassword,
      teamId,
    });

    logger.success(`应用公证完成: ${appName}`);
  } catch (error) {
    logger.error('应用公证失败', error);
    throw error;
  }
}
