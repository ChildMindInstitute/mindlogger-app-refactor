import { FileSystem } from 'react-native-file-access';
import { FileLogger } from 'react-native-file-logger';
import RNFetchBlob from 'rn-fetch-blob';

import { FileService } from '@app/shared/api';

import { IS_ANDROID } from '../constants';
import { IMutex, Mutex, isAppOnline } from '../utils';

const isAndroid = IS_ANDROID;

const isIos = !isAndroid;

interface ILogger {
  log: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  configure: () => void;
  send: () => Promise<boolean>;
  cancelSending: () => void;
  clearAllLogFiles: () => Promise<void>;
}

type NamePath = {
  fileName: string;
  filePath: string;
};

type NamePathSize = {
  size: number;
} & NamePath;

type FileExists = {
  exists: boolean;
} & NamePathSize;

class Logger implements ILogger {
  private mutex: IMutex;

  private cancellationRequested: boolean;

  constructor() {
    this.mutex = Mutex();
    this.cancellationRequested = false;
  }

  private async callWithMutex(func: () => void | Promise<any>) {
    if (this.mutex.isBusy()) {
      return;
    }
    try {
      this.mutex.setBusy();
      await func();
    } finally {
      this.mutex.release();
    }
  }

  private isNamedAsLatest(name: string) {
    return name.toLowerCase().includes('latest');
  }

  private async getLogFiles(): Promise<NamePathSize[]> {
    const filePaths = await FileLogger.getLogFilePaths();

    const result: Array<NamePathSize> = [];

    for (let path of filePaths) {
      const fileInfo = await FileSystem.stat(path);
      result.push({
        fileName: fileInfo.filename,
        filePath: path,
        size: fileInfo.size,
      });
    }

    if (isIos) {
      return result;
    } else {
      const latest = result.find(x => this.isNamedAsLatest(x.fileName))!;

      const rest = result.filter(x => x !== latest);

      const sorted = rest.sort((x, y) => (x.fileName > y.fileName ? -1 : 1));

      return latest ? [latest, ...sorted] : sorted;
    }
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
        size: existRecord.size,
      });
    }

    return result;
  }

  private async sendInternal(): Promise<boolean> {
    let logFiles: NamePathSize[];

    try {
      logFiles = await this.getLogFiles();
    } catch (error) {
      console.warn(
        '[Logger.getLogFiles]: Error occurred\n\n',
        error!.toString(),
      );
      return false;
    }

    if (this.cancellationRequested) {
      return false;
    }

    let checkResult: FileExists[];

    try {
      checkResult = await this.checkIfFilesExist(
        logFiles.map<NamePath>(x => ({
          fileName: x.fileName,
          filePath: x.filePath,
        })),
      );
    } catch (error) {
      console.warn(
        '[Logger.checkIfFilesExist]: Error occurred\n\n',
        error!.toString(),
      );
      return false;
    }

    let success = true;

    for (let checkRecord of checkResult) {
      if (this.cancellationRequested) {
        return false;
      }

      const file: NamePathSize = logFiles.find(
        x => x.fileName === checkRecord.fileName,
      )!;

      const isExist = checkRecord.exists;

      const isSizeTheSame = checkRecord.size === file.size;

      const isCurrentLogInAndroid = this.isNamedAsLatest(checkRecord.fileName);

      const shouldUpload =
        !isExist ||
        (isExist && isAndroid && isCurrentLogInAndroid) ||
        (isExist && isIos && !isSizeTheSame);

      if (!shouldUpload) {
        continue;
      }

      try {
        console.info(
          `[Logger.sendInternal] Sending log file "${checkRecord.fileName}"`,
        );

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

  // PUBLIC

  public configure() {
    const documentDir = RNFetchBlob.fs.dirs.DocumentDir;

    const logsDir = `${documentDir}/Logs`;

    FileLogger.configure({
      maximumFileSize: 1024, // 1 KB, todo - 1MB after integration
      maximumNumberOfFiles: 5,
      captureConsole: false,
      dailyRolling: true,
      logsDirectory: logsDir,
    });
  }

  public async clearAllLogFiles() {
    try {
      await this.callWithMutex(FileLogger.deleteLogFiles);
    } catch (error) {
      console.warn(
        'Logger.clearAllLogFiles]: Error occurred\n\n',
        error!.toString(),
      );
    }
  }

  public log(message: string) {
    console.log(message);

    this.callWithMutex(() => FileLogger.debug(message));
  }

  public info(message: string) {
    console.info(message);

    this.callWithMutex(() => FileLogger.info(message));
  }

  public warn(message: string) {
    console.warn(message);

    this.callWithMutex(() => FileLogger.warn(message));
  }

  public error(message: string) {
    console.error(message);

    this.callWithMutex(() => FileLogger.error(message));
  }

  public async send(): Promise<boolean> {
    const isOnline = await isAppOnline();
    if (!isOnline) {
      return false;
    }

    if (this.mutex.isBusy()) {
      return false;
    }

    try {
      this.mutex.setBusy();

      this.cancellationRequested = false;

      console.info('[Logger.send] Started sending log files to Server');

      const result = await this.sendInternal();

      console.info('[Logger.send] Completed sending log files to Server');

      return result;
    } catch (error) {
      console.warn(
        '[Logger.sendInternal]: Error occurred: \n\n',
        error!.toString(),
      );
    } finally {
      this.mutex.release();
    }
    return false;
  }

  public cancelSending(): void {
    this.cancellationRequested = true;
  }
}

export default new Logger();