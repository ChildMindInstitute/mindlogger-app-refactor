import { useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { EntityType } from '@app/abstract/lib';
import { PassSurveyModel } from '@app/features/pass-survey';

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
    if (isFlow) {
      Initializer.initializeFlow({ flowId: entityId, eventId });
    }
  }, [Initializer, eventId, isFlow, entityId]);

  useMemo(() => {
    if (!isFlow) {
      Initializer.initializeActivity({ activityId: entityId, eventId });
    }
  }, [Initializer, eventId, isFlow, entityId]);
}
