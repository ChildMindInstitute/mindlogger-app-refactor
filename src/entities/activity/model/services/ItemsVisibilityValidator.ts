import { LookupEntityInput } from '@app/abstract/lib';

import EntityActivitiesCollector from './EntityActivitiesCollector';
import { ActivityDetails } from '../../lib';

type ItemsVisibilityValidator = {
  hasActivityWithHiddenAllItems: (lookupInput: LookupEntityInput) => boolean;
};

const createItemsVisibilityValidator = (): ItemsVisibilityValidator => {
  const check = (activity: ActivityDetails): boolean => {
    return activity.items.every((item) => {
      return item.isHidden;
    });
  };

  function hasActivityWithHiddenAllItems(
    lookupInput: LookupEntityInput,
  ): boolean {
    const activitiesToLookup: ActivityDetails[] =
      EntityActivitiesCollector.collect(lookupInput);

    return activitiesToLookup.some((activity) => {
      return check(activity);
    });
  }

  return {
    hasActivityWithHiddenAllItems,
  };
};

export default createItemsVisibilityValidator();
