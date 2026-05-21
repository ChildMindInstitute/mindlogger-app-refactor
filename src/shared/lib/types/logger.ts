export type NamePath = {
  fileName: string;
  filePath: string;
};

export type NamePathSize = {
  size: number;
} & NamePath;

export type FileExists = {
  exists: boolean;
} & NamePathSize;

export type DeviceInfoLogObject = {
  brand: string;
  readableVersion: string;
  buildNumber: string;
  firstInstallTime: number;
  freeDiskStorage: number;
  lastUpdateTime: number;
};

export interface ILogger {
  log: (message: string, context?: object) => void;
  info: (message: string, context?: object) => void;
  warn: (message: string, context?: object) => void;
  error: (message: string, context?: object) => void;
  configure: () => void;
  send: () => Promise<boolean>;
  cancelSending: () => void;
  clearAllLogFiles: () => Promise<void>;
}
