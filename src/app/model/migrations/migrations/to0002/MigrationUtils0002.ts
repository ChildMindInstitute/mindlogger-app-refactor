import { CacheManager } from '@georstat/react-native-image-cache';
import { QueryClient } from '@tanstack/react-query';

import {
  Logger,
  getActivityDetailsKey,
  getAppletDetailsKey,
  getAppletsKey,
  getDataFromQuery,
} from '@app/shared/lib';

import {
  ActivityDto,
  ActivityResponse,
  AppletDetailsDto,
  AppletDetailsResponse,
  AppletDto,
  AppletsResponse,
  ImageUrl,
} from './MigrationDtoTypes0002';

export class QueryDataUtils {
  private queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  getAppletsDto(): AppletDto[] | null {
    const result = getDataFromQuery<AppletsResponse>(
      getAppletsKey(),
      this.queryClient,
    );

    return result?.result ?? null;
  }

  getAppletDto(appletId: string): AppletDetailsDto | null {
    const result = getDataFromQuery<AppletDetailsResponse>(
      getAppletDetailsKey(appletId),
      this.queryClient,
    );

    return result?.result ?? null;
  }

  getActivityDto(activityId: string): ActivityDto | null {
    const result = getDataFromQuery<ActivityResponse>(
      getActivityDetailsKey(activityId),
      this.queryClient,
    );

    return result?.result ?? null;
  }
}

export const collectFlankerImagesWithinActivity = (
  activityDto: ActivityDto,
): ImageUrl[] => {
  const result: ImageUrl[] = [];

  activityDto.items.forEach(item => {
    if (item.responseType === 'flanker') {
      const { config } = item;

      config.fixationScreen && result.push(config.fixationScreen.image);
      config.buttons.forEach(button => {
        button.image && result.push(button.image);
      });
      config.stimulusTrials.forEach(trial => {
        trial.image && result.push(trial.image);
      });
    }
  });

  return result;
};

export const isUrlValid = (url: string): boolean => {
  return url.includes('www') || url.includes('http');
};

export const cacheImage = (url: ImageUrl) => {
  try {
    if (!isUrlValid(url)) {
      Logger.warn(`[cacheImages] URL "${url}" is not valid`);
      return;
    }

    CacheManager.prefetch(url);
  } catch (err) {
    Logger.warn(
      `[cacheImages] Ignored due to error:
      url: ${url}
      error: ${(err as Error).message}`,
    );
  }
};
