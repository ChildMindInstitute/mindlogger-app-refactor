import { DdLogs } from '@datadog/mobile-react-native';
import { format } from 'date-fns';
import { LogLevel } from 'react-native-file-logger';

import { ILogger } from '../types/logger';

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
