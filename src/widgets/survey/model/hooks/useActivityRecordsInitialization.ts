import { useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { EntityType } from '@app/abstract/lib/types/entity';
import { ActivityRecordInitializer } from '@app/features/pass-survey/model/ActivityRecordInitializer';

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

  const { remainingActivityIds, remainingActivityOrders } = useFlowState({
    appletId,
    eventId,
    flowId: entityType === 'flow' ? entityId : undefined,
    targetSubjectId,
  });

  const Initializer = useMemo(
    () =>
      ActivityRecordInitializer({
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
        flowActivityOrders: remainingActivityOrders,
      });
    }
  }, [
    Initializer,
    eventId,
    targetSubjectId,
    isFlow,
    remainingActivityIds,
    remainingActivityOrders,
  ]);

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
