import { useEffect, useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { PassSurveyModel } from '@app/features/pass-survey';

type UseActivityRecordsInitializationArgs = {
  appletId: string;
  activityId: string;
  eventId: string;
  flowId?: string;
};

export function useActivityRecordsInitialization({
  appletId,
  activityId,
  eventId,
  flowId,
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

  useEffect(() => {
    if (flowId) {
      Initializer.initializeFlow({ flowId, eventId });
    } else {
      Initializer.initialize({ activityId, eventId });
    }
  }, [Initializer, activityId, eventId, flowId]);
}
