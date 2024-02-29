import { NativeModules } from 'react-native';

import { FileSystem } from 'react-native-file-access';
import { Asset } from 'react-native-image-picker';

import { IS_IOS } from '../constants';
import { Logger } from '../services';

export const ImageConverter = {
  async convertHeicToJpg(heicImage: Asset): Promise<Asset> {
    if (IS_IOS) {
      Logger.info(
        '[ImageConverter] Unexpected attempt to convert HEIC image on iOS',
      );
      return Promise.resolve(heicImage);
    }

    const pathPrefix = 'file://';
    const filePath = heicImage.uri!.replace(pathPrefix, '');

    const convertedFilePath: string =
      await NativeModules.ImageConversionModule.convertHeicToJpg(filePath);

    const newFileUri = pathPrefix + convertedFilePath;
    const fileStat = await FileSystem.stat(newFileUri);

    const jpegImage: Asset = {
      ...heicImage,
      uri: newFileUri,
      fileName: fileStat.filename,
      fileSize: fileStat.size,
      type: 'image/jpg',
    };

    return jpegImage;
  },
};
