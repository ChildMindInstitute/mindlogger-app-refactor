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

  const isFlow = !!flowId;

  useEffect(() => {
    if (isFlow) {
      Initializer.initializeFlow({ flowId, eventId });
    }
  }, [Initializer, eventId, flowId, isFlow]);

  useEffect(() => {
    if (!isFlow) {
      Initializer.initializeActivity({ activityId, eventId });
    }
  }, [Initializer, activityId, eventId, isFlow]);
}
