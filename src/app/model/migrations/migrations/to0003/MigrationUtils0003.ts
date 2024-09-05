import { CacheManager } from '@georstat/react-native-image-cache';
import { QueryClient } from '@tanstack/react-query';

import {
  Logger,
  filterDuplicates,
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
} from './MigrationDtoTypes0003';

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

const collectMarkdownImageUrls = (markdown: string): Array<string> => {
  const imageUrls: string[] = [];

  const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;
  const htmlImageRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/g;
  const imageWithSizeRegex = /\[.*?\]\((.*?)(?:\s*=\d*x?\d*)?\)/g;
  const imageSizeRegex = /\s*=\d*x?\d*$/;

  let match;

  while ((match = markdownImageRegex.exec(markdown)) !== null) {
    imageUrls.push(match[1].replace(imageSizeRegex, ''));
  }

  while ((match = imageWithSizeRegex.exec(markdown)) !== null) {
    imageUrls.push(match[1].replace(imageSizeRegex, ''));
  }

  while ((match = htmlImageRegex.exec(markdown)) !== null) {
    imageUrls.push(match[1]);
  }

  return filterDuplicates(imageUrls);
};

export const collectMarkdownImagesWithinActivity = (
  activityDto: ActivityDto,
): ImageUrl[] => {
  const result: ImageUrl[] = [];

  activityDto.items.forEach(item => {
    const markdownImages = collectMarkdownImageUrls(item.question);

    result.push(...markdownImages);
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
