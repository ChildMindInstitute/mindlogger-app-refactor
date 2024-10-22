import { FileSystem, Dirs } from 'react-native-file-access';
import { v4 as uuidv4 } from 'uuid';

import { ILogger } from '@app/shared/lib/types/logger';

import { ISvgFileManager, SvgFileMeta } from './ISvgFileManager';

const filesCacheDir = Dirs.CacheDir;

const getFilePath = (fileName: string) => {
  return `file://${filesCacheDir}/${fileName}`;
};

export class SvgFileManager implements ISvgFileManager {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  public getFileMeta(fileName: string | null): SvgFileMeta {
    if (!fileName?.length) {
      fileName = `${uuidv4()}.svg`;
    }

    const filePath = getFilePath(fileName);

    return {
      fileName,
      type: 'image/svg',
      uri: filePath,
    };
  }

  public async writeFile(filePath: string, svg: string): Promise<void> {
    try {
      const fileExists = await FileSystem.exists(filePath);

      if (fileExists) {
        await FileSystem.unlink(filePath);
      }

      await FileSystem.writeFile(filePath, svg);
    } catch (error) {
      this.logger.warn(
        '[SvgFileManager.writeFile]: Error occurred while deleting or writing a file\n\n' +
          error,
      );
    }
  }
}
