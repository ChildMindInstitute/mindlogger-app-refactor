import { useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { EntityType } from '@app/abstract/lib';
import { PassSurveyModel } from '@app/features/pass-survey';

import { useFlowState } from './useFlowState';

type UseActivityRecordsInitializationArgs = {
  appletId: string;
  eventId: string;
  entityId: string;
  entityType: EntityType;
};

export function useActivityRecordsInitialization({
  appletId,
  eventId,
  entityId,
  entityType,
}: UseActivityRecordsInitializationArgs) {
  const queryClient = useQueryClient();

  const { restFlowActivityIds } = useFlowState({
    appletId,
    eventId,
    flowId: entityType === 'flow' ? entityId : undefined,
  });

  const Initializer = useMemo(
    () =>
      PassSurveyModel.ActivityRecordInitializer({
        queryClient,
        appletId,
      }),
    [appletId, queryClient],
  );

  const isFlow = entityType === 'flow';

  useMemo(() => {
    if (isFlow && restFlowActivityIds.length) {
      Initializer.initializeFlowActivities({
        eventId,
        flowActivityIds: restFlowActivityIds,
      });
    }
  }, [Initializer, eventId, isFlow, restFlowActivityIds]);

  useMemo(() => {
    if (!isFlow && restFlowActivityIds.length) {
      Initializer.initializeActivity({ activityId: entityId, eventId });
    }
  }, [Initializer, eventId, isFlow, entityId, restFlowActivityIds]);
}
