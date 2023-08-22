import { useMemo } from 'react';

import { useIsRestoring, useQueryClient } from '@tanstack/react-query';

import { ActivityPipelineType } from '@app/abstract/lib';
import {
  getMonthAgoDate,
  useAppDispatch,
  useAppSelector,
} from '@app/shared/lib';

import useAppletVersions from './useAppletVersions';
import { useCompletedEntitiesQuery } from '../../api';
import { CompletedEntity } from '../../lib';
import { mapCompletedEntityFromDto } from '../mappers';
import { selectInProgressEntities } from '../selectors';
import { AppletQueryService } from '../services';
import { actions } from '../slice';

type Callbacks = {
  onSuccess: () => void;
};

function useEntitiesProgressSync(callbacks: Callbacks, enabled = true) {
  const queryClient = useQueryClient();
  const isCacheRestoring = useIsRestoring();

  const dispatch = useAppDispatch();
  const inProgressEntities = useAppSelector(selectInProgressEntities);

  const appletQueryService = useMemo(
    () => new AppletQueryService(queryClient),
    [queryClient],
  );

  const appletVersions = useAppletVersions() ?? null;

  useCompletedEntitiesQuery(getMonthAgoDate(), appletVersions, {
    // @ts-ignore
    onSuccess: (response, { appletId }) => {
      const completedEntities = [
        ...response.data.result.activities.map(mapCompletedEntityFromDto),
        ...response.data.result.activityFlows.map(mapCompletedEntityFromDto),
      ];

      const diffsFound = completedEntities.map(completedEntity =>
        syncAppletEntityWithServer(appletId, completedEntity),
      );

      const hasChanges = diffsFound.filter(Boolean).length > 0;

      if (hasChanges) {
        callbacks.onSuccess();
      }
    },
    enabled: !isCacheRestoring && enabled,
  });

  function syncAppletEntityWithServer(
    appletId: string,
    completedEntity: CompletedEntity,
  ) {
    let diffFound = false;

    const localEndAt =
      inProgressEntities?.[completedEntity.entityId]?.[completedEntity.eventId]
        .endAt;
    const serverEndAt = completedEntity.endAt;

    const appletDetails = appletQueryService.getAppletDetails(appletId);

    const entityEventMissing =
      !inProgressEntities?.[completedEntity.entityId]?.[
        completedEntity.eventId
      ];
    const isFlow = appletDetails.activityFlows.find(
      flow => flow.id === completedEntity.entityId,
    );

    if (entityEventMissing) {
      dispatch(
        actions.completedEntityMissing({
          type: isFlow
            ? ActivityPipelineType.Flow
            : ActivityPipelineType.Regular,
          startAt: serverEndAt,
          endAt: serverEndAt,
          appletId,
          entityId: completedEntity.entityId,
          eventId: completedEntity.eventId,
        }),
      );

      diffFound = true;
    }

    const completedLaterThanFromServer = localEndAt && localEndAt < serverEndAt;

    if (completedLaterThanFromServer) {
      dispatch(
        actions.completedEntityUpdated({
          endAt: serverEndAt,
          appletId,
          entityId: completedEntity.entityId,
          eventId: completedEntity.eventId,
        }),
      );

      diffFound = true;
    }

    return diffFound;
  }
}

export default useEntitiesProgressSync;
