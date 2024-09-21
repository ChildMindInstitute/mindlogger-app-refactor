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
  targetSubjectId: string | null;
};

export function useActivityRecordsInitialization({
  appletId,
  eventId,
  entityId,
  entityType,
  targetSubjectId,
}: UseActivityRecordsInitializationArgs) {
  const queryClient = useQueryClient();

  const { remainingActivityIds } = useFlowState({
    appletId,
    eventId,
    flowId: entityType === 'flow' ? entityId : undefined,
    targetSubjectId,
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
    if (isFlow && remainingActivityIds.length) {
      Initializer.initializeFlowActivities({
        eventId,
        targetSubjectId,
        flowActivityIds: remainingActivityIds,
      });
    }
  }, [Initializer, eventId, targetSubjectId, isFlow, remainingActivityIds]);

  useMemo(() => {
    if (!isFlow && remainingActivityIds.length) {
      Initializer.initializeActivity({
        activityId: entityId,
        eventId,
        targetSubjectId,
      });
    }
  }, [
    Initializer,
    eventId,
    isFlow,
    entityId,
    targetSubjectId,
    remainingActivityIds,
  ]);
}
