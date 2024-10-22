import { format } from 'date-fns';
import DeviceInfo from 'react-native-device-info';
import { Dirs, FileSystem } from 'react-native-file-access';
import { FileLogger, LogLevel } from 'react-native-file-logger';

import { IFileService } from '@app/shared/api/services/IFileService';
import { IMutex } from '@shared/lib/utils/IMutex';

import { IS_ANDROID, IS_IOS } from '../constants';
import { getNotificationSettingsData } from '../permissions/notificationPermissions';
import {
  DeviceInfoLogObject,
  FileExists,
  ILogger,
  NamePath,
  NamePathSize,
} from '../types/logger';
import {
  Mutex,
  callWithMutexAsync,
  callWithMutex,
  wait,
} from '../utils/common';
import { isAppOnline } from '../utils/networkHelpers';

export class Logger implements ILogger {
  private mutex: IMutex;

  private abortController: AbortController;

  private consoleLogLevel: LogLevel;

  private fileService: IFileService;

  constructor(fileService: IFileService) {
    this.mutex = Mutex();
    this.abortController = new AbortController();
    this.consoleLogLevel = LogLevel.Debug; // for developers
    this.fileService = fileService;
  }

  private withTime(message: string) {
    return format(new Date(), 'HH:mm:ss') + ': ' + message;
  }

  private get isAborted(): boolean {
    return this.abortController.signal.aborted;
  }

  private isNamedAsLatest(name: string) {
    return name.toLowerCase().includes('latest');
  }

  private async getLogFiles(): Promise<NamePathSize[]> {
    const filePaths = await FileLogger.getLogFilePaths();

    const result: Array<NamePathSize> = [];

    for (const path of filePaths) {
      const fileInfo = await FileSystem.stat(path);
      result.push({
        fileName: fileInfo.filename,
        filePath: path,
        size: fileInfo.size,
      });
    }

    if (IS_IOS) {
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
    const checkResult = await this.fileService.checkIfLogsExist({
      files: files.map(x => x.fileName),
    });

    const result: FileExists[] = [];

    for (const existRecord of checkResult.data.result) {
      const fileInfo = files.find(x => x.fileName === existRecord.fileId)!;

      result.push({
        ...fileInfo,
        exists: existRecord.uploaded,
        size: existRecord.fileSize || 0,
      });
    }

    return result;
  }

  private async appendNotificationLogs(): Promise<void> {
    const notificationSettings = await getNotificationSettingsData();

    const rawNotificationSettings = JSON.stringify(notificationSettings);

    this.log(
      `[Logger:appendNotificationLogs] NotificationSettings: ${rawNotificationSettings}`,
    );
  }

  private async appendDeviceInfoLogs(): Promise<void> {
    const {
      getBrand,
      getReadableVersion,
      getBuildNumber,
      getFirstInstallTime,
      getFreeDiskStorage,
      getLastUpdateTime,
    } = DeviceInfo;

    const deviceInfo: DeviceInfoLogObject = {
      brand: getBrand(),
      readableVersion: getReadableVersion(),
      buildNumber: getBuildNumber(),
      firstInstallTime: await getFirstInstallTime(),
      freeDiskStorage: await getFreeDiskStorage(),
      lastUpdateTime: await getLastUpdateTime(),
    };

    const rawDeviceInfo = JSON.stringify(deviceInfo);

    this.log(`[Logger:appendDeviceInfoLogs] DeviceInfo: ${rawDeviceInfo}`);
  }

  private async onBeforeSendLogs(): Promise<void> {
    try {
      await this.appendNotificationLogs();
      await this.appendDeviceInfoLogs();
    } catch (error) {
      console.warn('[Logger.onBeforeSendLogs]: Error occurred: \n\n', error);
    }
  }

  private async isAppOnline() {
    return isAppOnline();
  }

  private async sendInternal(): Promise<boolean> {
    let logFiles: NamePathSize[];

    try {
      logFiles = await this.getLogFiles();
    } catch (error) {
      console.warn(`[Logger.getLogFiles]: Error occurred\n\n${error}`);
      return false;
    }

    if (this.isAborted) {
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
      console.warn(`[Logger.checkIfFilesExist]: Error occurred\n\n${error}`);
      return false;
    }

    let success = true;

    for (const checkRecord of checkResult) {
      if (this.isAborted) {
        return false;
      }

      const localFile: NamePathSize = logFiles.find(
        x => x.fileName === checkRecord.fileName,
      )!;

      const isExist = checkRecord.exists;

      const isSizeTheSame = checkRecord.size === localFile.size;

      const isFileNamedAsCurrent = this.isNamedAsLatest(checkRecord.fileName);

      const isFileEmpty = localFile.size === 0;

      const shouldUpload =
        !isFileEmpty &&
        (!isExist ||
          (isExist && IS_ANDROID && isFileNamedAsCurrent) ||
          (isExist && IS_IOS && !isSizeTheSame));

      if (!shouldUpload) {
        continue;
      }

      try {
        console.info(
          `[Logger.sendInternal] Sending log file "${checkRecord.fileName}"`,
        );

        await this.fileService.uploadLogFile({
          fileName: checkRecord.fileName,
          uri: checkRecord.filePath,
          type: 'text/x-log',
          fileId: checkRecord.fileName,
        });
      } catch (error) {
        console.warn(
          `[Logger.upload]: Error occurred while sending file "${checkRecord.fileName}"\n\n${error}`,
        );
        success = false;
      }
    }

    return success;
  }

  // PUBLIC

  public configure(logLevel: LogLevel = LogLevel.Debug) {
    const documentDir = Dirs.DocumentDir;

    const logsDir = `${documentDir}/Logs`;

    FileLogger.configure({
      maximumFileSize: 1024 * 1024,
      maximumNumberOfFiles: 5,
      captureConsole: false,
      dailyRolling: true,
      logsDirectory: logsDir,
      logLevel: logLevel,
    });
  }

  public async clearAllLogFiles() {
    try {
      await callWithMutexAsync(this.mutex, FileLogger.deleteLogFiles);
    } catch (error) {
      console.warn(`Logger.clearAllLogFiles]: Error occurred\n\n${error}`);
    }
  }

  public log(message: string) {
    if (this.consoleLogLevel <= LogLevel.Debug) {
      console.log(this.withTime(message));
    }

    callWithMutex(this.mutex, () => FileLogger.debug(message));
  }

  public info(message: string) {
    if (this.consoleLogLevel <= LogLevel.Info) {
      console.info(this.withTime(message));
    }

    callWithMutex(this.mutex, () => FileLogger.info(message));
  }

  public warn(message: string) {
    if (this.consoleLogLevel <= LogLevel.Warning) {
      console.warn(this.withTime(message));
    }

    callWithMutex(this.mutex, () => FileLogger.warn(message));
  }

  public error(message: string) {
    if (this.consoleLogLevel <= LogLevel.Error) {
      console.error(this.withTime(message));
    }

    callWithMutex(this.mutex, () => FileLogger.error(message));
  }

  public async send(): Promise<boolean> {
    const isOnline = await this.isAppOnline();
    if (!isOnline) {
      return false;
    }

    let attemptsLeft = 5;

    while (this.mutex.isBusy() && attemptsLeft > 0) {
      await wait(500);
      attemptsLeft--;
    }

    if (this.mutex.isBusy()) {
      return false;
    }

    try {
      this.mutex.setBusy();

      await this.onBeforeSendLogs();

      this.abortController = new AbortController();

      console.info('[Logger.send] Sending log files to Server');

      const result = await this.sendInternal();

      console.info('[Logger.send] Sent');

      return result;
    } catch (error) {
      console.warn(`[Logger.sendInternal]: Error occurred: \n\n${error}`);
    } finally {
      this.mutex.release();
    }
    return false;
  }

  public cancelSending(): void {
    this.abortController.abort();
  }
}
