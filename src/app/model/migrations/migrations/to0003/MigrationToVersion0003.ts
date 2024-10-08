import { QueryClient } from '@tanstack/react-query';

import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { RootStateFrom, RootStateTo } from './MigrationReduxTypes0003';
import {
  QueryDataUtils,
  cacheImage,
  collectMarkdownImagesWithinActivity,
} from './MigrationUtils0003';
import { IMigration, MigrationInput, MigrationOutput } from '../../types';

export class MigrationToVersion0003
  implements IMigration<RootStateFrom, RootStateTo>
{
  private queryDataUtils: QueryDataUtils;

  constructor(queryClient: QueryClient) {
    this.queryDataUtils = new QueryDataUtils(queryClient);
  }

  private cacheAllMarkdownImages() {
    const appletsDto = this.queryDataUtils.getAppletsDto();

    if (!appletsDto) {
      throw Error(
        '[MigrationToVersion0003.cacheAllMarkdownImages]: Applets DTO not found',
      );
    }

    const activityIds = appletsDto
      .map(applet => {
        const appletDto = this.queryDataUtils.getAppletDto(applet.id);

        if (!appletDto) {
          throw Error(
            `[MigrationToVersion0003.cacheAllMarkdownImages]: Applet "${applet.displayName}|${applet.id}" DTO not found`,
          );
        }

        return appletDto.activities;
      })
      .flat()
      .map(activity => activity.id);

    const activitiesDto = activityIds.map(activityId => {
      const activityDto = this.queryDataUtils.getActivityDto(activityId);

      if (!activityDto) {
        throw Error(
          `[MigrationToVersion0003.cacheAllMarkdownImages]: Activity "${activityId}" DTO not found`,
        );
      }

      return activityDto;
    });

    const urlsToCache = activitiesDto
      .map(collectMarkdownImagesWithinActivity)
      .flat();

    urlsToCache.forEach(cacheImage);
  }

  migrate(input: MigrationInput<RootStateFrom>): MigrationOutput<RootStateTo> {
    try {
      this.cacheAllMarkdownImages();
    } catch (error) {
      getDefaultLogger()
        .error(`[MigrationToVersion0003.migrate]: An error ocurred during the migration:
        error:
        ${(error as Error).message}
      `);
    }

    return input as MigrationOutput<RootStateTo>;
  }
}
