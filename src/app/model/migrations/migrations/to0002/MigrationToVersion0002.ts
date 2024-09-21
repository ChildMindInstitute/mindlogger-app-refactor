import { QueryClient } from '@tanstack/react-query';

import { Logger } from '@app/shared/lib';

import { RootStateFrom, RootStateTo } from './MigrationReduxTypes0002';
import {
  QueryDataUtils,
  cacheImage,
  collectFlankerImagesWithinActivity,
} from './MigrationUtils0002';
import { IMigration, MigrationInput, MigrationOutput } from '../../types';

export class MigrationToVersion0002
  implements IMigration<RootStateFrom, RootStateTo>
{
  private queryDataUtils: QueryDataUtils;

  constructor(queryClient: QueryClient) {
    this.queryDataUtils = new QueryDataUtils(queryClient);
  }

  private cacheAllFlankerImages() {
    const appletsDto = this.queryDataUtils.getAppletsDto();

    if (!appletsDto) {
      throw Error(
        '[MigrationToVersion0002.cacheAllFlankerImages]: Applets DTO not found',
      );
    }

    const activityIds = appletsDto
      .map(applet => {
        const appletDto = this.queryDataUtils.getAppletDto(applet.id);

        if (!appletDto) {
          throw Error(
            `[MigrationToVersion0002.cacheAllFlankerImages]: Applet "${applet.displayName}|${applet.id}" DTO not found`,
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
          `[MigrationToVersion0002.cacheAllFlankerImages]: Activity "${activityId}" DTO not found`,
        );
      }

      return activityDto;
    });

    const urlsToCache = activitiesDto
      .map(collectFlankerImagesWithinActivity)
      .flat();

    urlsToCache.forEach(cacheImage);
  }

  migrate(input: MigrationInput<RootStateFrom>): MigrationOutput<RootStateTo> {
    try {
      this.cacheAllFlankerImages();
    } catch (error) {
      Logger.error(`[MigrationToVersion0002.migrate]: An error ocurred during the migration:
        error:
        ${(error as Error).message}
      `);
    }

    return input as MigrationOutput<RootStateTo>;
  }
}
