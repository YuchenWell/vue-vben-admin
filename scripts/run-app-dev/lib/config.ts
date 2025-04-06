import type { LogLevel } from 'vite';

import type { Mode } from './types';

import minimist from 'minimist';

// 解析命令行参数
export const parseArgs = () => {
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

  return parsedArgs;
};

// 全局配置
export const getConfig = () => {
  const parsedArgs = parseArgs();
  const mode = (process.env.MODE = process.env.MODE || parsedArgs.mode) as Mode;
  const logLevel: LogLevel = 'warn';
  const watch = parsedArgs.watch;

  return {
    logLevel,
    mode,
    watch,
  };
};
