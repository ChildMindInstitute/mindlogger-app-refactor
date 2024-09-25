import { LookupEntityInput } from '@app/abstract/lib/types/entity';

import { IEntityActivitiesCollector } from './IEntityActivitiesCollector';
import { IItemsVisibilityValidator } from './IItemsVisibilityValidator';
import { ActivityDetails } from '../../lib/types/activity';

export const createItemsVisibilityValidator = (
  entityActivityCollector: IEntityActivitiesCollector,
): IItemsVisibilityValidator => {
  const check = (activity: ActivityDetails): boolean => {
    return activity.items.every(item => {
      return item.isHidden;
    });
  };

  function hasActivityWithHiddenAllItems(
    lookupInput: LookupEntityInput,
  ): boolean {
    const activitiesToLookup: ActivityDetails[] =
      entityActivityCollector.collect(lookupInput);

    return activitiesToLookup.some(activity => {
      return check(activity);
    });
  }

  return {
    hasActivityWithHiddenAllItems,
  };
};
