import { FileSystem } from 'react-native-file-access';
import { FileLogger } from 'react-native-file-logger';

import Logger from './Logger';
import { Logger as LoggerClass } from './Logger';

jest.mock('@shared/api', () => ({
  FileService: {
    checkIfLogsExist: jest.fn(),
  },
}));

jest.mock('react-native-file-access', () => ({
  FileSystem: {
    stat: jest.fn(),
  },
  Dirs: {
    DocumentDir: 'documentDir',
  },
}));

jest.mock('@shared/lib', () => ({
  isAppOnline: jest.fn(),
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

describe('Logger: regular tests', () => {
  it('should add a timestamp to the message', async () => {
    const input = 'Some input string';

    // @ts-expect-error
    const result = Logger.withTime(input);

    expect(result).toHaveLength(input.length + 10);
    expect(result).toContain(`: ${input}`);
  });

  it('should return empty array for no files', async () => {
    const files: string[] = [];

    require('@shared/api').FileService.checkIfLogsExist.mockResolvedValue({
      data: {
        result: [],
      },
    });

    // @ts-expect-error
    const result = await Logger.checkIfFilesExist(files);
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

    require('@shared/api').FileService.checkIfLogsExist.mockResolvedValue({
      data: {
        result: response,
      },
    });

    // @ts-expect-error
    const result = await Logger.checkIfFilesExist(files);

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
    (FileLogger.getLogFilePaths as jest.Mock).mockReturnValue([
      '/path/to/file1.log',
      '/path/to/file2.log',
    ]);

    (FileSystem.stat as jest.Mock).mockImplementation(async (path: string) => {
      if (path === '/path/to/file1.log') {
        return { filename: 'file1.log', size: 1024 };
      } else if (path === '/path/to/file2.log') {
        return { filename: 'file2.log', size: 512 };
      }

      throw new Error('File not found');
    });

    // @ts-expect-error
    const result = await Logger.getLogFiles();

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
  it('Should do 5 waiting mutex attempts (or 7 check if mutex is busy) when sending logs', async () => {
    const logger = new LoggerClass();

    //@ts-expect-error
    logger.onBeforeSendLogs = jest.fn();
    //@ts-expect-error
    logger.sendInternal = jest.fn();
    //@ts-expect-error
    logger.isAppOnline = jest.fn().mockResolvedValue(true);

    const isBusyMock = jest.fn(() => true);
    //@ts-expect-error
    logger.mutex.isBusy = isBusyMock;

    //@ts-expect-error
    logger.mutex.setBusy();

    const result = await logger.send();

    expect(result).toEqual(false);
    expect(isBusyMock).toBeCalledTimes(7);
  });
});
