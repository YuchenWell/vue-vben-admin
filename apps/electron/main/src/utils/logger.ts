import { shell } from 'electron';
import log from 'electron-log/main';

log.initialize();

const logger = log.scope('MAIN_PROCESS');

/** 获取日志文件信息 */
const getLogFile = () => {
  return log.transports?.file?.getFile();
};

/** 打开日志文件 */
const openLogFile = () => {
  const logFile = getLogFile();

  if (logFile?.path) {
    shell.openPath(logFile.path).catch((error) => {
      logger.error(`打开日志文件失败: ${error}`);
    });
    return true;
  }

  logger.warn('无法获取日志文件路径');
  return false;
};

/** 打开日志文件所在目录 */
const openLogDir = () => {
  const logFile = getLogFile();

  if (logFile?.path) {
    shell.showItemInFolder(logFile.path);
    return true;
  }

  logger.warn('无法获取日志文件路径');
  return false;
};

export { getLogFile, logger, openLogDir, openLogFile };
