import { FileStat, FileSystem } from 'react-native-file-access';
import { FileLogger } from 'react-native-file-logger';

import { getDefaultFileService } from '@app/shared/api/services/fileServiceInstance';
import { IFileService } from '@app/shared/api/services/IFileService';
import { IMutex } from '@shared/lib/utils/IMutex.ts';

import { Logger } from './Logger';
import { getDefaultLogger } from './loggerInstance';
import { ILogger, NamePath } from '../types/logger';

jest.mock('react-native-file-access', () => ({
  FileSystem: {
    stat: jest.fn(),
  },
  Dirs: {
    DocumentDir: 'documentDir',
  },
}));

jest.mock('react-native-file-logger', () => ({
  FileLogger: {
    getLogFilePaths: jest.fn(),
    configure: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    deleteLogFiles: jest.fn(),
  },
  LogLevel: {
    Debug: 1,
  },
}));

type TestLogger = ILogger & {
  mutex: IMutex;
  withTime: Logger['withTime'];
  checkIfFilesExist: Logger['checkIfFilesExist'];
  getLogFiles: Logger['getLogFiles'];
  onBeforeSendLogs: Logger['onBeforeSendLogs'];
  sendInternal: Logger['sendInternal'];
  isAppOnline: Logger['isAppOnline'];
};

describe('Logger: regular tests', () => {
  let logger: TestLogger;
  let fileService: IFileService;

  beforeEach(() => {
    logger = getDefaultLogger() as never as TestLogger;
    fileService = getDefaultFileService();
  });

  it('should add a timestamp to the message', async () => {
    const input = 'Some input string';

    const result = logger.withTime(input);

    expect(result).toHaveLength(input.length + 10);
    expect(result).toContain(`: ${input}`);
  });

  it('should return empty array for no files', async () => {
    const files: NamePath[] = [];

    jest.spyOn(fileService, 'checkIfLogsExist').mockResolvedValue({
      data: {
        result: [],
      },
    } as never);

    const result = await logger.checkIfFilesExist(files);

    expect(result).toEqual([]);
  });

  it('should return file information for existing files', async () => {
    const files = [
      { fileName: 'file1.log', filePath: '/path/to/file1.log' },
      { fileName: 'file2.log', filePath: '/path/to/file2.log' },
    ];
    const response = [
      { fileId: 'file1.log', uploaded: true, fileSize: 1024 },
      { fileId: 'file2.log', uploaded: false, fileSize: 512 },
    ];

    jest.spyOn(fileService, 'checkIfLogsExist').mockResolvedValue({
      data: {
        result: response,
      },
    } as never);

    const result = await logger.checkIfFilesExist(files);

    expect(result).toEqual([
      {
        fileName: 'file1.log',
        filePath: '/path/to/file1.log',
        exists: true,
        size: 1024,
      },
      {
        fileName: 'file2.log',
        filePath: '/path/to/file2.log',
        exists: false,
        size: 512,
      },
    ]);
  });

  it('should return file information for existing log files', async () => {
    jest
      .spyOn(FileLogger, 'getLogFilePaths')
      .mockResolvedValue(['/path/to/file1.log', '/path/to/file2.log']);

    jest.spyOn(FileSystem, 'stat').mockImplementation(
      (path: string) =>
        new Promise((resolve, reject) => {
          if (path === '/path/to/file1.log') {
            resolve({ filename: 'file1.log', size: 1024 } as FileStat);
          } else if (path === '/path/to/file2.log') {
            resolve({ filename: 'file2.log', size: 512 } as FileStat);
          } else {
            reject(new Error('File not found'));
          }
        }),
    );

    const result = await logger.getLogFiles();

    expect(result).toEqual([
      {
        fileName: 'file1.log',
        filePath: '/path/to/file1.log',
        size: 1024,
      },
      {
        fileName: 'file2.log',
        filePath: '/path/to/file2.log',
        size: 512,
      },
    ]);
  });
});

describe('Logger: test sending files', () => {
  let logger: TestLogger;

  beforeEach(() => {
    logger = getDefaultLogger() as never as TestLogger;
  });

  it('Should do 5 waiting mutex attempts (or 7 check if mutex is busy) when sending logs', async () => {
    jest.spyOn(logger, 'onBeforeSendLogs').mockResolvedValue(undefined);
    jest.spyOn(logger, 'sendInternal').mockResolvedValue(true);
    jest.spyOn(logger, 'isAppOnline').mockResolvedValue(true);

    jest.spyOn(logger.mutex, 'isBusy').mockReturnValue(true);
    logger.mutex.setBusy();

    const result = await logger.send();

    expect(result).toEqual(false);
    expect(logger.mutex.isBusy).toHaveBeenCalledTimes(7);
  });
});
