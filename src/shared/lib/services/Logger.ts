import { FileSystem } from 'react-native-file-access';
import { FileLogger } from 'react-native-file-logger';
import RNFetchBlob from 'rn-fetch-blob';

import { FileService } from '@app/shared/api';

interface ILogger {
  log: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  configure: () => void;
  send: () => void;
}

type NamePath = {
  fileName: string;
  filePath: string;
};

type FileExists = {
  exists: boolean;
} & NamePath;

class Logger implements ILogger {
  constructor() {}

  public configure() {
    const documentDir = RNFetchBlob.fs.dirs.DocumentDir;

    const logsDir = `${documentDir}/Logs`;

    FileLogger.configure({
      maximumFileSize: 1024, // 1 KB
      maximumNumberOfFiles: 5,
      captureConsole: false,
      dailyRolling: true,
      logsDirectory: logsDir,
    });
  }

  public log(message: string) {
    console.log(message);
    FileLogger.debug(message);
  }

  public info(message: string) {
    console.info(message);
    FileLogger.info(message);
  }

  public warn(message: string) {
    console.warn(message);
    FileLogger.warn(message);
  }

  public error(message: string) {
    console.error(message);
    FileLogger.error(message);
  }

  private async getLogFiles() {
    const filePaths = await FileLogger.getLogFilePaths();

    const result: Array<NamePath> = [];

    for (let path of filePaths) {
      const fileInfo = await FileSystem.stat(path);
      result.push({
        fileName: fileInfo.filename,
        filePath: path,
      });
    }

    return result;
  }

  private async checkIfFilesExist(
    files: Array<NamePath>,
  ): Promise<FileExists[]> {
    const checkResult = await FileService.checkIfLogsExist({
      filesToCheck: files.map(x => x.fileName),
    });

    const result: FileExists[] = [];

    for (let existRecord of checkResult.data.result.files) {
      const fileInfo = files.find(x => x.fileName === existRecord.fileName)!;
      result.push({
        ...fileInfo,
        exists: existRecord.exists,
      });
    }

    return result;
  }

  public async send(): Promise<boolean> {
    let logFiles: NamePath[];

    try {
      logFiles = await this.getLogFiles();
    } catch (error) {
      console.warn(
        '[Logger.getLogFiles]: Error occurred\n\n',
        error!.toString(),
      );
      return false;
    }

    let checkResult: FileExists[];

    try {
      checkResult = await this.checkIfFilesExist(logFiles);
    } catch (error) {
      console.warn(
        '[Logger.checkIfFilesExist]: Error occurred\n\n',
        error!.toString(),
      );
      return false;
    }

    let success = true;

    for (let checkRecord of checkResult) {
      if (checkRecord.exists) {
        continue;
      }

      try {
        await FileService.upload(
          {
            fileName: checkRecord.fileName,
            uri: checkRecord.filePath,
            type: 'log',
          },
          'log',
        );
      } catch (error) {
        console.warn(
          `[Logger.upload]: Error occurred while sending file "${checkRecord.fileName}"\n\n`,
          error!.toString(),
        );
        success = false;
      }
    }

    return success;
  }
}

export default new Logger();
