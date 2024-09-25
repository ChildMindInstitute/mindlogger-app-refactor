import { QueryClient } from '@tanstack/react-query';

import { EntityProgression } from '@app/abstract/lib/types/entityProgress';

import { ActivityListGroup } from '../../lib/types/activityGroup';

export type BuildResult = {
  groups: ActivityListGroup[];
  isCacheInsufficientError?: boolean;
  otherError?: boolean;
};

export type IActivityGroupsBuildManager = {
  process: (
    appletId: string,
    entityProgressions: EntityProgression[],
    queryClient: QueryClient,
  ) => BuildResult;
};
