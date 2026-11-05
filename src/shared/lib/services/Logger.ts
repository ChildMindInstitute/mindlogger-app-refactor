import { DdLogs } from '@datadog/mobile-react-native';
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

export const withAdditionalInfo = (
  message: string,
  additionalInfo?: string,
): string => {
  return additionalInfo ? `${message}: ${additionalInfo}` : message;
};

export class ConsoleLogger implements ILogger {
  
  private consoleLogLevel: LogLevel;
  
  constructor() {
    this.consoleLogLevel = LogLevel.Debug; // for developers
  }
  

  configure(logLevel: LogLevel = LogLevel.Debug): void {
    this.consoleLogLevel = logLevel;
  }
  
  public log(message: string, context?: object) {
    if (this.consoleLogLevel <= LogLevel.Debug) {
      console.log(this.withTime(message));
      DdLogs.info(message, context).then(r => {});
    }

  }

  public info(message: string, context?: object) {
    if (this.consoleLogLevel <= LogLevel.Info) {
      console.info(this.withTime(message));
      DdLogs.info(message, context).then(r => {});
    }

  }

  public warn(message: string, context?: object) {
    if (this.consoleLogLevel <= LogLevel.Warning) {
      console.warn(this.withTime(message));
      DdLogs.warn(message, context).then(r => {});
    }
  }

  public error(message: string, context?: object) {
    if (this.consoleLogLevel <= LogLevel.Error) {
      console.error(this.withTime(message));
      DdLogs.error(message, context).then(r => {});
    }
  }


  private withTime(message: string) {
    return format(new Date(), 'HH:mm:ss') + ': ' + message;
  }
  
}
