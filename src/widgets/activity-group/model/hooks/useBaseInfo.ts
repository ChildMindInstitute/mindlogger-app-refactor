import { useBaseQuery } from '@app/shared/api/hooks/useBaseQuery';
import { ResponseType } from '@app/shared/api/services/ActivityItemDto';
import { getDefaultAppletsService } from '@app/shared/api/services/appletsServiceInstance';

import { useTimer } from './useTimer';

export const useBaseInfo = (appletId: string) => {
  useTimer();

  return useBaseQuery(
    ['base-info', { appletId }],
    () => getDefaultAppletsService().getAppletBaseInfo({ appletId }),
    {
      select: data => {
        const activityResponseTypes =
          data.data.result.activities?.reduce(
            (curr, activity) => ({
              ...curr,
              [activity.id]: activity.containsResponseTypes,
            }),
            {} as Record<string, ResponseType[]>,
          ) || {};
        const flowResponseTypes = data.data.result.activityFlows?.reduce(
          (curr, activityFlow) => ({
            ...curr,
            [activityFlow.id]: (activityFlow?.activityIds || [])
              .map(activityId => activityResponseTypes[activityId])
              .flat(),
          }),
          {} as Record<string, ResponseType[]>,
        );

        return {
          ...data.data.result,
          responseTypes: { ...activityResponseTypes, ...flowResponseTypes },
        };
      },
    },
  );
};
