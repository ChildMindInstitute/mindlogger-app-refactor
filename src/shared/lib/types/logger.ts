export interface ILogger {
  log: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  configure: () => void;
  send: () => Promise<boolean>;
  cancelSending: () => void;
  clearAllLogFiles: () => Promise<void>;
}
