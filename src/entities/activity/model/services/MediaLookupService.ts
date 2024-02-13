import { LookupEntityInput } from '@app/abstract/lib';
import { ActivityDetails } from '@app/entities/activity';

import EntityActivitiesCollector from './EntityActivitiesCollector';

const createMediaLookupService = () => {
  const lookupInMarkdown = (message: string): boolean => {
    const videoFound = message.includes('<video');
    const audioFound = message.includes('<audio');
    const youtubeFound = message.includes('youtu');

    return videoFound || audioFound || youtubeFound;
  };

  const lookupInActivity = (activity: ActivityDetails): boolean => {
    return activity.items.some((item) => {
      return (
        lookupInMarkdown(item.question) || item.inputType === 'AudioPlayer'
      );
    });
  };

  const lookup = (lookupInput: LookupEntityInput): boolean => {
    const activitiesToLookup: ActivityDetails[] =
      EntityActivitiesCollector.collect(lookupInput);

    return activitiesToLookup.some((activity) => {
      return lookupInActivity(activity);
    });
  };

  return {
    hasMediaReferences: lookup,
  };
};

export default createMediaLookupService();
