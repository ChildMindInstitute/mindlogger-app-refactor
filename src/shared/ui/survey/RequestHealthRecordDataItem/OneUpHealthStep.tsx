import { FC, useContext, useMemo } from 'react';

import { EntityProgressionInProgress } from '@app/abstract/lib/types/entityProgress';
import { selectAppletsEntityProgressions } from '@app/entities/applet/model/selectors';
import { ActivityIdentityContext } from '@app/features/pass-survey/lib/contexts/ActivityIdentityContext';
import { useOneUpHealthSystemSearchApi } from '@app/shared/api/hooks/useOneUpHealthSystemSearchApi';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { getEntityProgression } from '@app/shared/lib/utils/survey/survey';
import { YStack } from '@app/shared/ui/base';
import { Spinner } from '@app/shared/ui/Spinner';
import { Text } from '@app/shared/ui/Text';

export const OneUpHealthStep: FC = () => {
  const { appletId, activityId, flowId, eventId, targetSubjectId } = useContext(
    ActivityIdentityContext,
  );

  const progressions = useAppSelector(selectAppletsEntityProgressions);
  const progression = useMemo(
    () =>
      getEntityProgression(
        appletId,
        flowId ?? activityId,
        eventId,
        targetSubjectId,
        progressions,
      ) as EntityProgressionInProgress | undefined,
    [appletId, flowId, activityId, eventId, targetSubjectId, progressions],
  );

  const submitId = progression?.submitId;

  const { accessToken, searchResults, isLoading, error } =
    useOneUpHealthSystemSearchApi({ appletId, submitId, activityId }, {});

  // TODO: Render full search interface - just debugging info for now
  return (
    <YStack
      space="$4"
      px="$4"
      alignItems="center"
      justifyContent="center"
      flex={1}
    >
      <Text>{accessToken}</Text>
      {error ? (
        <Text>{JSON.stringify(error)}</Text>
      ) : isLoading ? (
        <Spinner />
      ) : (
        <Text>{JSON.stringify(searchResults)}</Text>
      )}
    </YStack>
  );
};
