import { NativeModules } from 'react-native';

import { CacheManager } from '@georstat/react-native-image-cache';
import SHA1 from 'crypto-js/sha1';

const getCachedImageLocalPath = (cacheKey: string) => {
  const filename = cacheKey.substring(
    cacheKey.lastIndexOf('/'),
    cacheKey.indexOf('?') === -1 ? cacheKey.length : cacheKey.indexOf('?'),
  );
  const ext =
    filename.indexOf('.') === -1
      ? '.jpg'
      : filename.substring(filename.lastIndexOf('.'));
  const sha = SHA1(cacheKey);
  const path = `${CacheManager.config.baseDir}${sha}${ext}`;

  return path;
};

type Dimensions = {
  width: number;
  height: number;
};

export const getImageSize = (url: string): Dimensions | null => {
  const source = getCachedImageLocalPath(url);

  const result = NativeModules.ImageDimensions.getImageDimensionsSync(source);

  return result;
};
