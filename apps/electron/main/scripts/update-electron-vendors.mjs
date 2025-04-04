/**
 * 这个脚本要在 electron 上下文中运行
 */

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const electronRelease = process.versions;

const node = electronRelease.node.split('.')[0];
const chrome = electronRelease.v8.split('.').splice(0, 2).join('');

const browserslistrcPath = path.resolve(
  process.cwd(),
  '../../web',
  '.browserslistrc',
);

writeFileSync(
  './.electron-vendors.cache.json',
  JSON.stringify({ chrome, node }, null, 2),
);

writeFileSync(browserslistrcPath, `Chrome ${chrome}`, 'utf8');
