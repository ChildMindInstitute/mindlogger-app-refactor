import { LookupEntityInput } from '@app/abstract/lib/types/entity';

import { IEntityActivitiesCollector } from './IEntityActivitiesCollector';
import { IMediaLookupService } from './IMediaLookupService';
import { ActivityDetails } from '../../lib/types/activity';

export const createMediaLookupService = (
  entityActivitiesCollector: IEntityActivitiesCollector,
): IMediaLookupService => {
  const lookupInMarkdown = (message: string): boolean => {
    const videoFound = message.includes('<video');
    const audioFound = message.includes('<audio');
    const youtubeFound = message.includes('youtu');

    return videoFound || audioFound || youtubeFound;
  };

  const lookupInActivity = (activity: ActivityDetails): boolean => {
    return activity.items.some(item => {
      return (
        lookupInMarkdown(item.question) || item.inputType === 'AudioPlayer'
      );
    });
  };

  const lookup = (lookupInput: LookupEntityInput): boolean => {
    const activitiesToLookup: ActivityDetails[] =
      entityActivitiesCollector.collect(lookupInput);

    return activitiesToLookup.some(activity => {
      return lookupInActivity(activity);
    });
  };

  return {
    hasMediaReferences: lookup,
  };
};
