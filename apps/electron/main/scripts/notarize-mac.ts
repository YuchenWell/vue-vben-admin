import type { AfterPackContext } from 'electron-builder';

import { env } from 'node:process';

import { notarize } from '@electron/notarize';

/** macOS应用程序签名流程 - https://github.com/electron/notarize
 * 验证签名是否成功: codesign -dv --verbose=4 /path/to/your/file.dmg
 */
export async function notarizeMac(context: AfterPackContext) {
  const { electronPlatformName, appOutDir } = context;

  // 仅对Mac平台进行处理
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  // 检查必要的环境变量是否存在
  const appleId = env.APPLE_ID;
  const applePassword = env.APPLE_PASSWORD;
  const teamId = env.APPLE_TEAM_ID;

  if (!appleId || !applePassword || !teamId) {
    throw new Error(
      '缺少必要的环境变量: APPLE_ID, APPLE_PASSWORD 或 APPLE_TEAM_ID',
    );
  }

  return await notarize({
    appPath: `${appOutDir}/${appName}.app`,
    tool: 'notarytool',
    appleId, // 苹果开发者账号
    appleIdPassword: applePassword, // 苹果开发者密码
    teamId, // 开发者团队 id
  });
}
