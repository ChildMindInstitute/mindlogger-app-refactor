import { FileSystem, Dirs } from 'react-native-file-access';
import { v4 as uuidv4 } from 'uuid';

import { ILogger, Logger } from '@app/shared/lib';

const filesCacheDir = Dirs.CacheDir;

type SvgFileMeta = {
  fileName: string;
  type: 'image/svg';
  uri: string;
};

class SvgFileManager {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  public static getFilePath = (fileName: string) => {
    return `file://${filesCacheDir}/${fileName}`;
  };

  public getFileMeta(fileName: string | null): SvgFileMeta {
    if (!fileName?.length) {
      fileName = `${uuidv4()}.svg`;
    }

    const filePath = SvgFileManager.getFilePath(fileName);

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
      Logger.warn(`[SvgFileManager.writeFile]: Error occurred while deleting or writing a file\n\n${error}`);
    }
  }
}

export default new SvgFileManager(Logger);
