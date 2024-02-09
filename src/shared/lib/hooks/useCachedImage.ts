import { useState, useEffect } from 'react';

import { CacheManager } from '@georstat/react-native-image-cache';

import { getFilePath, Logger } from '@app/shared/lib';

function useCachedImage(uri?: string) {
  const [source, setSource] = useState<string | null>(uri ?? null);

  useEffect(() => {
    async function fetchCachedImage() {
      if (!uri) {
        return;
      }

      try {
        const path = await CacheManager.get(uri, {}).getPath();

        if (path) {
          setSource(getFilePath(path));
        } else {
          Logger.warn(`[useCachedImage] No cache entry was found for uri:${uri}`);
        }
      } catch (error) {
        Logger.error(`[useCachedImage] Fetching of the path for ${uri} failed: \n\n: ${error}`);
      }
    }

    fetchCachedImage();
  }, [uri]);

  return source;
}

export default useCachedImage;
