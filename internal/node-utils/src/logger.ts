import chalk from 'chalk';

/**
 * 日志接口
 */
interface Logger {
  error: (message: string, ...args: any[]) => void;
  info?: (message: string, ...args: any[]) => void;
  log?: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
}

/**
 * 创建彩色日志工具
 */
const createColorfulLogger = (logger: Logger = console) => {
  return {
    error: (message: string, ...args: any[]) => {
      logger.error(
        `${chalk.bgRed(' ERROR ')} ${chalk.redBright(message)}`,
        ...args,
      );
    },
    info: (message: string, ...args: any[]) => {
      // 优先使用logger.info，其次使用logger.log，最后使用logger.warn
      const logMethod = logger.info || logger.log || logger.warn;

      logMethod.call(
        logger,
        `${chalk.bgBlue(' INFO ')} ${chalk.cyan(message)}`,
        ...args,
      );
    },
    success: (message: string, ...args: any[]) => {
      const logMethod = logger.info || logger.log || logger.warn;

      logMethod.call(
        logger,
        `${chalk.bgGreen(' DONE ')} ${chalk.greenBright(message)}`,
        ...args,
      );
    },
    warn: (message: string, ...args: any[]) => {
      logger.warn(
        `${chalk.bgYellow(' WARN ')} ${chalk.yellowBright(message)}`,
        ...args,
      );
    },
  };
};

// 默认导出使用console的日志工具实例
const logger = createColorfulLogger();

export { createColorfulLogger, logger };
